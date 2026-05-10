// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from "../components/DashbordLayout";
import BookModal from "../components/BookModal"; // ← import modular
import { BookOpen, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const colors = {
  lightBeige: "#F5F1ED",
  beige: "#E2D9D0",
  brown: "#B49E88",
  textDark: "#4A3F35",
  teal: "#1a7a8a",
};

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksRes, categoriesRes] = await Promise.all([
          axios.get('/api/books'),
          axios.get('/api/categories')
        ]);

        if (booksRes.data.success) {
          setBooks(booksRes.data.data);
        }
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data?.data ?? categoriesRes.data ?? []);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        toast.error("Gagal memuat data dari server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-[#B49E88] p-10 text-white">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-4xl font-bold mb-4">Temukan buku favoritmu.</h1>
            <p className="text-stone-100 mb-6">
              Akses koleksi buku digital tinggi untuk mendukung studi dan hobimu di Tebudi!
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: colors.textDark }}>
            Koleksi Terbaru
          </h2>
          <span className="text-sm font-medium text-stone-500">
            {filteredBooks.length} Buku ditemukan
          </span>
        </div>

        {/* Book Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-4"
              style={{ borderColor: colors.brown }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 group-hover:-translate-y-2">
                  <img
                    src={book.coverURL || "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm z-10 ${
                      book.isPremium ? "bg-amber-400 text-amber-950" : "bg-emerald-400 text-emerald-950"
                    }`}
                  >
                    {book.isPremium ? "Premium" : "Gratis"}
                  </span>
                  <div className="absolute inset-0 bg-opacity-0 hover:bg-black/50 transition-all flex items-center justify-center">
                    <BookOpen className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                  </div>
                </div>
                <h3 className="font-bold text-lg leading-tight mb-1 truncate" style={{ color: colors.textDark }}>
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold text-gray-600">0.0</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300">
            <p className="text-gray-500">Maaf, buku yang kamu cari tidak ditemukan.</p>
          </div>
        )}
      </div>

      {/* Modal — sekarang pakai komponen modular */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          // isSubscribed tidak dipass → modal akan cek ke API otomatis
        />
      )}
    </DashboardLayout>
  );
}