import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Bookmark, Moon, Sun } from 'lucide-react';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function ReadBookPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [isDataReady, setIsDataReady] = useState(false); 
    const [initialPage, setInitialPage] = useState(0); 
    const currentPageRef = useRef(0);
    const totalPagesRef = useRef(0);

    const [isDarkMode, setIsDarkMode] = useState(false); //mode ireng

    // (Menghilangkan Print & Download) ---
    const renderToolbar = (Toolbar) => (
        <Toolbar>
            {(slots) => {
                const {
                    CurrentPageInput, EnterFullScreen, GoToNextPage, GoToPreviousPage,
                    NumberOfPages, ShowSearchPopover, Zoom, ZoomIn, ZoomOut,
                } = slots;
                
                return (
                    <div className="flex items-center w-full px-2 py-1 gap-2">
                        <div><ShowSearchPopover /></div>
                        <div className="h-4 w-px bg-stone-300 mx-1"></div>
                        <div><ZoomOut /></div>
                        <div><Zoom /></div>
                        <div><ZoomIn /></div>
                        
                        <div className="flex-1 flex justify-center items-center gap-2">
                            <GoToPreviousPage />
                            <div className="flex items-center text-sm font-medium">
                                <CurrentPageInput /> 
                                <span className="mx-2 text-stone-500">/</span> 
                                <NumberOfPages />
                            </div>
                            <GoToNextPage />
                        </div>
                        
                        <div className="h-4 w-px bg-stone-300 mx-1"></div>
                        <div><EnterFullScreen /></div>
                    </div>
                );
            }}
        </Toolbar>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
    });

    const handleDocumentLoad = (e) => {
        totalPagesRef.current = e.doc.numPages;
    };

    useEffect(() => {
        let objectUrl = null;

        const fetchBookAndProgress = async () => {
            try {
                try {
                    const progressRes = await axios.get(`${BASE_URL}/api/progress/${id}`, {
                        withCredentials: true 
                    });
                    
                    if (progressRes.data.success && progressRes.data.data) {
                        const savedPage = progressRes.data.data.currentPage;
                        setInitialPage(savedPage - 1);
                        currentPageRef.current = savedPage - 1; 
                        toast.success(`Melanjutkan dari halaman ${savedPage}`, {
                            id: 'toast-progress-baca'
                        });
                    }
                } catch (err) {
                    console.log("Belum ada progres baca untuk buku ini.");
                }

                const response = await axios.get(`${BASE_URL}/api/books/${id}/read`, {
                    responseType: 'blob',
                    withCredentials: true
                });
                
                objectUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                setFileUrl(objectUrl);

                setIsDataReady(true);

            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error("Akses ditolak! Pastikan kamu sudah login/Premium.");
                } else {
                    toast.error("Gagal memuat buku.");
                }
                navigate('/home'); 
            } finally {
                setLoading(false);
            }
        };

        fetchBookAndProgress();

        return () => {
            if (objectUrl) {
                window.URL.revokeObjectURL(objectUrl);
            }
        };
    }, [id, navigate]);

    // --- LOGIKA AUTO-SAVE ---
    const saveProgressToDatabase = async () => {
        if (!isDataReady) return; 

        const actualPageToSave = currentPageRef.current + 1; 
        try {
            await axios.put(`${BASE_URL}/api/progress/${id}`, {
                currentPage: actualPageToSave,
                totalPages: totalPagesRef.current 
            }, {
                withCredentials: true 
            });
            console.log("Berhasil save progress. Total halaman:", totalPagesRef.current);
        } catch (error) {
            console.error("Gagal auto-save progres", error);
        }
    };

    const handlePageChange = (e) => {
        currentPageRef.current = e.currentPage;
    };

    const handleClose = async () => {
        await saveProgressToDatabase();
        navigate('/home');
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            saveProgressToDatabase();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            saveProgressToDatabase(); 
        };
    }, [id, isDataReady]);

    if (loading || !isDataReady) {
        return (
            <div className={`flex h-screen items-center justify-center ${isDarkMode ? 'bg-stone-900' : 'bg-stone-50'}`}>
                <div className="flex flex-col items-center gap-3">
                    <svg className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-[#D1BFAe]' : 'text-[#A3846B]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Mempersiapkan buku dan progresmu...</p>
                </div>
            </div>
        );
    }

    return (
        // Latar belakang utama reaktif terhadap Dark Mode
        <div className={`flex flex-col h-screen transition-colors duration-300 ${isDarkMode ? 'bg-stone-900 text-stone-200' : 'bg-stone-100 text-stone-800'}`}>
            
            {/* Header */}
            <div className={`border-b p-4 flex items-center shadow-sm z-10 shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                <button
                    onClick={handleClose}
                    className={`flex items-center gap-2 font-medium text-sm px-3 py-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-stone-300 hover:bg-stone-700 hover:text-white' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'}`}
                >
                    <ArrowLeft size={18} />
                    <span className="hidden sm:inline">Tutup & Simpan</span>
                </button>
                
                <div className="flex-1 text-center font-serif font-bold flex items-center justify-center gap-2">
                    <Bookmark size={18} className={isDarkMode ? 'text-[#D1BFAe]' : 'text-[#A3846B]'} />
                    TeBuDi Reader
                </div>
                
                {/* Tombol Toggle Dark Mode */}
                <div className="w-24 flex justify-end">
                    <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-stone-700 text-yellow-400 hover:bg-stone-600' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                        title={isDarkMode ? "Matikan Mode Gelap" : "Nyalakan Mode Gelap"}
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>

            {/* Kontainer Viewer */}
            <div className="flex-1 overflow-hidden w-full h-full md:p-6 flex justify-center">
                <div className={`w-full max-w-5xl h-full shadow-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a] border-stone-700' : 'bg-white border-stone-300'}`}>
                    
                    {fileUrl && isDataReady && (
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                            <Viewer
                                fileUrl={fileUrl}
                                plugins={[defaultLayoutPluginInstance]}
                                initialPage={initialPage}
                                onPageChange={handlePageChange}
                                onDocumentLoad={handleDocumentLoad}
                                theme={isDarkMode ? 'dark' : 'light'} // <--- Fitur bawaan Library untuk Dark Mode PDF UI
                            />
                        </Worker>
                    )}
                    
                </div>
            </div>
        </div>
    );
}