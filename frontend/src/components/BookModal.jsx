/**
 * @file components/BookModal.jsx
 * @description Modal detail buku — responsif untuk mobile, tablet, dan desktop.
 *
 * Mobile  : layout vertikal, cover kecil di atas dengan overlay gradient,
 *           info buku di bawah dalam panel scrollable
 * Desktop : layout horizontal, cover di kiri (2/5), info di kanan (3/5)
 */

import { useNavigate } from "react-router-dom";
import { BookOpen, Star, X } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../services/apiClient";

const PLACEHOLDER_COVER =
  "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png";

export default function BookModal({ book, onClose, isSubscribed }) {
  const navigate = useNavigate();

  const handleReadClick = async () => {
    if (!book.isPremium) {
      navigate(`/read/${book.id}`);
      onClose();
      return;
    }

    if (isSubscribed !== undefined) {
      if (isSubscribed) {
        navigate(`/read/${book.id}`);
        onClose();
      } else {
        toast.error("Buku ini khusus pengguna Premium. Silakan berlangganan.", {
          id: "premium-toast",
        });
        navigate("/subscription");
        onClose();
      }
      return;
    }

    try {
      const response = await apiClient.get("/api/userSubs/status");
      if (response.data.success) {
        if (response.data.data.active) {
          navigate(`/read/${book.id}`);
          onClose();
        } else {
          toast.error("Buku ini khusus pengguna Premium. Silakan berlangganan.", {
            id: "premium-toast",
          });
          navigate("/subscription");
          onClose();
        }
      }
    } catch {
      toast.error("Gagal memeriksa status langganan. Pastikan kamu sudah login.", {
        id: "status-error",
      });
    }
  };

  const categoryName =
    book.category?.name ||
    book.category?.nameCategory ||
    book.categoryName ||
    "Kategori Umum";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/*
        Mobile  : sheet dari bawah (rounded-t-3xl), max-h 90vh
        Desktop : kartu tengah (rounded-3xl), max-w-2xl
      */}
      <div className="relative w-full sm:max-w-2xl bg-[#F9F7F4] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:flex-row max-h-[90vh] sm:max-h-[85vh]">

        {/* ── Tombol close ── */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 bg-white/90 hover:bg-white p-1.5 rounded-full text-stone-600 hover:text-stone-900 shadow-sm transition-all"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {/* ── Cover ── */}
        {/* Mobile: banner pendek dengan overlay gradient */}
        {/* Desktop: panel kiri penuh */}
        <div className="relative w-full sm:w-2/5 sm:flex-shrink-0 h-44 sm:h-auto bg-stone-200">
          <img
            src={book.coverURL || PLACEHOLDER_COVER}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          {/* Gradient bawah di mobile supaya teks terbaca */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F9F7F4] via-black/10 to-transparent sm:hidden" />

          {/* Badge premium/gratis di atas cover */}
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md shadow z-10 ${
              book.isPremium
                ? "bg-amber-400 text-amber-950"
                : "bg-emerald-400 text-emerald-950"
            }`}
          >
            {book.isPremium ? "Premium" : "Gratis"}
          </span>
        </div>

        {/* ── Info buku ── */}
        <div className="flex-1 flex flex-col overflow-y-auto p-5 sm:p-7 min-h-0">

          {/* Kategori */}
          <span className="text-[10px] font-bold tracking-widest text-[#B49E88] uppercase mb-2">
            {categoryName}
          </span>

          {/* Judul */}
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A3F35] leading-snug mb-1.5">
            {book.title}
          </h2>

          {/* Penulis */}
          <p className="text-sm text-stone-500 font-medium mb-3">
            Oleh <span className="text-[#1a7a8a]">{book.author}</span>
          </p>

          {/* Badge akses */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                book.isPremium
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {book.isPremium ? (
                <>
                  <Star size={11} className="fill-amber-500 text-amber-500" />
                  Akses Premium
                </>
              ) : (
                "Baca Gratis"
              )}
            </span>
          </div>

          {/* Deskripsi — scrollable jika panjang */}
          <p className="text-sm text-stone-600 leading-relaxed line-clamp-5 sm:line-clamp-none flex-1">
            {book.description ||
              "Buku ini tidak memiliki deskripsi. Mari mulai membaca untuk mengetahui isinya secara langsung."}
          </p>

          {/* Tombol baca — selalu di bawah */}
          <div className="pt-5 mt-auto">
            <button
              onClick={handleReadClick}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-2 text-sm ${
                book.isPremium ? "bg-[#B49E88]" : "bg-[#1a7a8a]"
              }`}
            >
              <BookOpen size={18} />
              {book.isPremium ? "Baca Buku Premium" : "Baca Sekarang"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
