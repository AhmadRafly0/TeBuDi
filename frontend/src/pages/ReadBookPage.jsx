/**
 * @file pages/ReadBookPage.jsx
 * @description Halaman pembaca buku PDF dengan fitur auto-save progress.
 */

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import apiClient from "../services/apiClient";
import toast from "react-hot-toast";
import { ArrowLeft, Bookmark, Moon, Sun } from "lucide-react";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

/** Base URL API — kosong di dev agar lewat Vite proxy, diisi di production */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function ReadBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [initialPage, setInitialPage] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  /** Ref untuk menyimpan halaman saat ini tanpa trigger re-render */
  const currentPageRef = useRef(0);
  /** Ref untuk menyimpan total halaman dokumen */
  const totalPagesRef = useRef(0);

  /** Toolbar custom: sembunyikan tombol print dan download. */
  const renderToolbar = (Toolbar) => (
    <Toolbar>
      {(slots) => {
        const {
          CurrentPageInput,
          EnterFullScreen,
          GoToNextPage,
          GoToPreviousPage,
          NumberOfPages,
          ShowSearchPopover,
          Zoom,
          ZoomIn,
          ZoomOut,
        } = slots;

        return (
          <div className="flex items-center w-full px-2 py-1 gap-2">
            <div>
              <ShowSearchPopover />
            </div>
            <div className="h-4 w-px bg-stone-300 mx-1" />
            <div>
              <ZoomOut />
            </div>
            <div>
              <Zoom />
            </div>
            <div>
              <ZoomIn />
            </div>
            <div className="flex-1 flex justify-center items-center gap-2">
              <GoToPreviousPage />
              <div className="flex items-center text-sm font-medium">
                <CurrentPageInput />
                <span className="mx-2 text-stone-500">/</span>
                <NumberOfPages />
              </div>
              <GoToNextPage />
            </div>
            <div className="h-4 w-px bg-stone-300 mx-1" />
            <div>
              <EnterFullScreen />
            </div>
          </div>
        );
      }}
    </Toolbar>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({ renderToolbar });

  /** Simpan total halaman saat dokumen selesai dimuat */
  const handleDocumentLoad = (e) => {
    totalPagesRef.current = e.doc.numPages;
  };

  /** Fetch progress baca dan file PDF saat komponen mount. */
  useEffect(() => {
    let activeObjectUrl = null;

    const fetchBookAndProgress = async () => {
      try {
        setLoading(true);
        setIsDataReady(false);

        // 1. Ambil progress baca sebelumnya
        let savedPageOffset = 0;
        try {
          const progressRes = await apiClient.get(`/api/progress/${id}`);
          if (progressRes.data.success && progressRes.data.data) {
            const savedPage = progressRes.data.data.currentPage;
            savedPageOffset = savedPage - 1; // PDF viewer pakai 0-indexed
            setInitialPage(savedPageOffset);
            currentPageRef.current = savedPageOffset;
            
            toast.success(`Melanjutkan dari halaman ${savedPage}`, {
              id: "toast-progress-baca",
            });
          }
        } catch (err) {
          console.log("Belum ada progress lama, mulai dari halaman 1.");
        }

        // 2. Fetch file PDF sebagai blob dari backend (backend proxy ke Cloudinary)
        // URL Cloudinary tidak pernah ter-expose ke frontend
        try {
          const token = localStorage.getItem("token");
          const pdfAxios = axios.create();
          delete pdfAxios.defaults.headers.common['Accept'];

          const response = await pdfAxios.get(`${BASE_URL}/api/books/${id}/read`, {
            responseType: "blob",
            headers: {
              'Accept': 'application/pdf, */*',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });

          // Cek jika backend kirim JSON error terbungkus blob
          if (response.data.type === "application/json") {
            const text = await response.data.text();
            const err = JSON.parse(text);
            throw new Error(err.message || "Gagal memuat berkas");
          }

          const pdfBlob = new Blob([response.data], { type: "application/pdf" });
          activeObjectUrl = window.URL.createObjectURL(pdfBlob);
          setFileUrl(activeObjectUrl);
          setIsDataReady(true);
        } catch (err) {
          console.error("Error loading PDF:", err);
          const msg = err.response?.data?.message || err.message || "Gagal memuat dokumen buku dari cloud";
          toast.error(msg);
        }

      } catch (error) {
        console.error("Error loading book:", error);
        if (error.response?.status === 401) {
          toast.error("Akses ditolak! Pastikan kamu sudah login/Premium.");
        } else {
          toast.error("Gagal memuat dokumen buku dari cloud.");
        }
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndProgress();

    // Cleanup: hapus URL blob dari memori saat user keluar halaman
    return () => {
      if (activeObjectUrl) {
        window.URL.revokeObjectURL(activeObjectUrl);
      }
    };
  }, [id, navigate]);

  /** Simpan progress baca ke API */
  const saveProgressToDatabase = async () => {
    if (!isDataReady) return;
    const actualPageToSave = currentPageRef.current + 1; // Kembalikan ke 1-indexed
    try {
      await apiClient.put(
        `/api/progress/${id}`,
        {
          currentPage: actualPageToSave,
          totalPages: totalPagesRef.current,
        }
      );
    } catch (error) {
      console.error("Gagal melakukan auto-save progres:", error);
    }
  };

  /** Update ref halaman saat user berpindah halaman */
  const handlePageChange = (e) => {
    currentPageRef.current = e.currentPage;
  };

  /** Tutup reader dengan menyimpan progress terlebih dahulu */
  const handleClose = async () => {
    await saveProgressToDatabase();
    navigate("/home");
  };

  /** Auto-save saat user menutup tab/browser (beforeunload) */
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgressToDatabase();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveProgressToDatabase(); 
    };
  }, [id, isDataReady]);

  // Loading state (Pastikan merender loading jika fileUrl belum siap sepenuhnya)
  if (loading || !isDataReady || !fileUrl) {
    return (
      <div
        className={`flex h-screen items-center justify-center ${
          isDarkMode ? "bg-stone-900" : "bg-stone-50"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <svg
            className={`w-8 h-8 animate-spin ${
              isDarkMode ? "text-[#D1BFAe]" : "text-[#A3846B]"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <p
            className={`text-sm font-medium ${
              isDarkMode ? "text-stone-400" : "text-stone-500"
            }`}
          >
            Mempersiapkan buku dan progresmu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-stone-900 text-stone-200" : "bg-stone-100 text-stone-800"
      }`}
    >
      {/* Header reader */}
      <div
        className={`border-b p-4 flex items-center shadow-sm z-10 shrink-0 transition-colors duration-300 ${
          isDarkMode
            ? "bg-stone-800 border-stone-700"
            : "bg-white border-stone-200"
        }`}
      >
        {/* Tombol tutup & simpan */}
        <button
          onClick={handleClose}
          className={`flex items-center gap-2 font-medium text-sm px-3 py-1.5 rounded-lg transition-colors ${
            isDarkMode
              ? "text-stone-300 hover:bg-stone-700 hover:text-white"
              : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Tutup & Simpan</span>
        </button>

        {/* Judul reader */}
        <div className="flex-1 text-center font-serif font-bold flex items-center justify-center gap-2">
          <Bookmark
            size={18}
            className={isDarkMode ? "text-[#D1BFAe]" : "text-[#A3846B]"}
          />
          TeBuDi Reader
        </div>

        {/* Tombol toggle dark mode */}
        <div className="w-24 flex justify-end">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode
                ? "bg-stone-700 text-yellow-400 hover:bg-stone-600"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200"
            }`}
            title={isDarkMode ? "Matikan Mode Gelap" : "Nyalakan Mode Gelap"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Kontainer PDF viewer */}
      <div className="flex-1 overflow-hidden w-full h-full md:p-6 flex justify-center">
        <div
          className={`w-full max-w-5xl h-full shadow-2xl border transition-colors duration-300 ${
            isDarkMode
              ? "bg-[#1a1a1a] border-stone-700"
              : "bg-white border-stone-300"
          }`}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={fileUrl}
              plugins={[defaultLayoutPluginInstance]}
              initialPage={initialPage}
              onPageChange={handlePageChange}
              onDocumentLoad={handleDocumentLoad}
              theme={isDarkMode ? "dark" : "light"}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
}