import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function ReadBookPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookStream = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/books/${id}/read`, {
                    responseType: 'blob',
                    withCredentials: true
                });

                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                setFileUrl(url);
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error("Akses ditolak! Pastikan kamu sudah berlangganan paket Premium.");
                } else {
                    toast.error("Gagal memuat buku. Buku mungkin tidak ditemukan.");
                }
                navigate('/home'); 
            } finally {
                setLoading(false);
            }
        };

        fetchBookStream();

        return () => {
            if (fileUrl) {
                window.URL.revokeObjectURL(fileUrl);
            }
        };
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-3">
                    <svg className="w-8 h-8 text-stone-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    <p className="text-sm font-medium text-stone-500">Mempersiapkan buku...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-stone-100">
            <div className="bg-white border-b border-stone-200 p-4 flex items-center shadow-sm">
                <button
                    onClick={() => navigate('/home')}
                    className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-stone-100"
                >
                    <ArrowLeft size={18} />
                    <span>Tutup</span>
                </button>
                <div className="flex-1 text-center font-serif font-bold text-stone-800">
                    TeBuDi Reader
                </div>
                <div className="w-20" />
            </div>

            {/*make iFrame local*/}
            <div className="flex-1 overflow-hidden w-full h-full p-2 md:p-6 flex justify-center">
                {fileUrl ? (
                    <iframe
                        src={fileUrl}
                        className="w-full max-w-5xl h-full rounded-xl shadow-lg border border-stone-300 bg-white"
                        title="Book Reader"
                    />
                ) : (
                    <div className="text-stone-500 mt-20">Dokumen tidak dapat ditampilkan.</div>
                )}
            </div>
        </div>
    );
}