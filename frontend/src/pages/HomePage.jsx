/**
 * @file pages/HomePage.jsx
 * @description Halaman utama dashboard setelah login.
 *
 * Menampilkan hero section dan grid koleksi buku.
 * Klik buku akan membuka BookModal untuk detail dan akses baca.
 */

import { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Star } from "lucide-react";
import toast from "react-hot-toast";

// Komponen modular
import DashboardLayout from "../components/layout/DashboardLayout";
import BookModal from "../components/BookModal";

/**
 * Halaman beranda dashboard.
 * Fetch buku dan kategori secara paralel saat mount.
 */
export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch buku dan kategori saat komponen mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksRes] = await Promise.all([
          axios.get("/api/books"),
        ]);
        if (booksRes.data.success) {
          setBooks(booksRes.data.data);
        }
      } catch {
        toast.error("Gagal memuat data dari server.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        {/* Hero section */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden mb-8 md:mb-10 bg-[#B49E88] p-6 md:p-10 text-white">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Temukan buku favoritmu.</h1>
            <p className="text-stone-100 text-sm md:text-base mb-4 md:mb-6">
              Akses koleksi buku digital tinggi untuk mendukung studi dan hobimu di Tebudi!
            </p>
          </div>
          {/* Dekorasi lingkaran */}
          <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 md:-mr-20 md:-mt-20" />
        </div>

        {/* Header koleksi */}
        <div className="flex justify-between items-center mb-5 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#4A3F35" }}>
            Koleksi Terbaru
          </h2>
          <span className="text-xs md:text-sm font-medium text-stone-500">
            {books.length} Buku
          </span>
        </div>

        {/* Grid buku */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-4"
              style={{ borderColor: "#B49E88" }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {books.map((book) => (
              <div
                key={book.id}
                className="group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                {/* Cover buku */}
                <div className="relative aspect-[3/4] mb-3 overflow-hidden rounded-xl md:rounded-2xl shadow-md transition-transform duration-300 group-hover:-translate-y-2">
                  <img
                    src={
                      book.coverURL ||
                      "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"
                    }
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  {/* Badge premium/gratis */}
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm z-10 ${
                      book.isPremium
                        ? "bg-amber-400 text-amber-950"
                        : "bg-emerald-400 text-emerald-950"
                    }`}
                  >
                    {book.isPremium ? "Premium" : "Gratis"}
                  </span>
                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-opacity-0 hover:bg-black/50 transition-all flex items-center justify-center">
                    <BookOpen
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      size={28}
                    />
                  </div>
                </div>

                {/* Info buku */}
                <h3
                  className="font-bold text-sm md:text-base leading-tight mb-1 truncate"
                  style={{ color: "#4A3F35" }}
                >
                  {book.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mb-1.5 truncate">{book.author}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold text-gray-600">0.0</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && books.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300">
            <p className="text-gray-500">Belum ada buku tersedia.</p>
          </div>
        )}
      </div>

      {/* Modal detail buku */}
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
