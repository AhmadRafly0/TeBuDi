/**
 * @file pages/CategoryPage.jsx
 * @description Halaman kategori buku.
 *
 * Fitur:
 * - Tampilkan semua kategori dari API (dinamis)
 * - Klik kategori → filter dan tampilkan buku dalam kategori tersebut
 * - Tombol "See All" untuk kembali ke semua buku
 * - Klik buku → buka BookModal untuk detail dan akses baca
 */

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Star, ArrowLeft, Grid3X3, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../services/apiClient";

import DashboardLayout from "../components/layout/DashboardLayout";
import BookModal from "../components/BookModal";
import { fetchAllCategories, fetchBooksByCategory } from "../services/categoryService";

// Warna latar untuk kartu kategori (berulang)
const CARD_COLORS = [
  "bg-amber-100 text-amber-800 border-amber-200",
  "bg-sky-100 text-sky-800 border-sky-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-violet-100 text-violet-800 border-violet-200",
  "bg-rose-100 text-rose-800 border-rose-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-teal-100 text-teal-800 border-teal-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
];

/**
 * Halaman kategori buku.
 * Menampilkan grid kategori dan buku yang difilter berdasarkan kategori yang dipilih.
 */
export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // { idCategory, nameCategory }
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch semua kategori saat mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingCategories(true);
        const cats = await fetchAllCategories();
        setCategories(cats);
      } catch {
        toast.error("Gagal memuat kategori.");
      } finally {
        setLoadingCategories(false);
      }
    };
    load();
  }, []);

  // Fetch semua buku saat mount (untuk tampilan "See All")
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get("/api/books");
        const data = res.data?.data ?? res.data ?? [];
        setAllBooks(data);
        setBooks(data);
      } catch {
        // silent — buku akan dimuat saat kategori dipilih
      }
    };
    load();
  }, []);

  /**
   * Pilih kategori dan fetch buku yang sesuai.
   */
  const handleSelectCategory = useCallback(async (cat) => {
    setSelectedCategory(cat);
    setLoadingBooks(true);
    try {
      const result = await fetchBooksByCategory(cat.nameCategory);
      setBooks(result);
    } catch {
      toast.error("Gagal memuat buku untuk kategori ini.");
      setBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  /**
   * Kembali ke tampilan semua buku.
   */
  const handleSeeAll = useCallback(() => {
    setSelectedCategory(null);
    setBooks(allBooks);
  }, [allBooks]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          {selectedCategory ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSeeAll}
                className="flex items-center gap-1.5 text-sm text-[#B49E88] hover:text-[#8a7a6a] transition-colors font-medium"
              >
                <ArrowLeft size={16} />
                Semua Kategori
              </button>
              <ChevronRight size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">
                {selectedCategory.nameCategory}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Grid3X3 size={22} className="text-[#B49E88]" />
              <h1 className="text-2xl font-bold text-[#4A3F35]">Kategori Buku</h1>
            </div>
          )}
        </div>

        {/* ── Grid Kategori (tampil saat belum pilih kategori) ── */}
        {!selectedCategory && (
          <>
            {loadingCategories ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#B49E88]" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                Belum ada kategori tersedia.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-10">
                {categories.map((cat, i) => (
                  <button
                    key={cat.idCategory}
                    onClick={() => handleSelectCategory(cat)}
                    className={`group relative flex flex-col items-center justify-center p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer ${
                      CARD_COLORS[i % CARD_COLORS.length]
                    }`}
                  >
                    <span className="text-2xl md:text-3xl mb-1.5 md:mb-2">📚</span>
                    <h2 className="text-sm md:text-base font-bold text-center leading-tight">
                      {cat.nameCategory}
                    </h2>
                    <span className="mt-1.5 text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                      Lihat buku →
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* ── Semua Buku (di bawah grid kategori) ── */}
            {!loadingCategories && allBooks.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-[#4A3F35]">Semua Buku</h2>
                  <span className="text-sm text-gray-400">{allBooks.length} buku</span>
                </div>
                <BookGrid
                  books={allBooks}
                  loading={false}
                  onBookClick={setSelectedBook}
                />
              </>
            )}
          </>
        )}

        {/* ── Tampilan Buku per Kategori ── */}
        {selectedCategory && (
          <>
            {/* Judul kategori + tombol See All */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F35]">
                  {selectedCategory.nameCategory}
                </h2>
                {!loadingBooks && (
                  <p className="text-sm text-gray-400 mt-1">
                    {books.length} buku ditemukan
                  </p>
                )}
              </div>
              <button
                onClick={handleSeeAll}
                className="text-sm px-4 py-2 rounded-lg border border-[#D9CFC7] text-[#B49E88] hover:bg-[#EFE9E3] transition-colors font-medium"
              >
                See All
              </button>
            </div>

            {/* Chip kategori lain untuk navigasi cepat — scrollable di mobile */}
            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.idCategory}
                    onClick={() => handleSelectCategory(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      cat.idCategory === selectedCategory.idCategory
                        ? "bg-[#B49E88] text-white border-[#B49E88]"
                        : "bg-white text-gray-600 border-[#D9CFC7] hover:border-[#B49E88] hover:text-[#B49E88]"
                    }`}
                  >
                    {cat.nameCategory}
                  </button>
                ))}
              </div>
            )}

            <BookGrid
              books={books}
              loading={loadingBooks}
              onBookClick={setSelectedBook}
              emptyMessage={`Tidak ada buku dalam kategori "${selectedCategory.nameCategory}".`}
            />
          </>
        )}
      </div>

      {/* Modal detail buku */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </DashboardLayout>
  );
}

/**
 * Komponen grid buku yang dapat digunakan ulang.
 *
 * @param {Object} props
 * @param {Array} props.books - Daftar buku
 * @param {boolean} props.loading - Status loading
 * @param {function} props.onBookClick - Callback saat buku diklik
 * @param {string} [props.emptyMessage] - Pesan saat tidak ada buku
 */
function BookGrid({ books, loading, onBookClick, emptyMessage = "Belum ada buku tersedia." }) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#B49E88]" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="group cursor-pointer"
          onClick={() => onBookClick(book)}
        >
          {/* Cover buku */}
          <div className="relative aspect-[3/4] mb-3 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 group-hover:-translate-y-2">
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
              className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm z-10 ${
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
                size={32}
              />
            </div>
          </div>

          {/* Info buku */}
          <h3
            className="font-bold text-sm leading-tight mb-1 truncate"
            style={{ color: "#4A3F35" }}
          >
            {book.title}
          </h3>
          <p className="text-xs text-gray-500 mb-1.5 truncate">{book.author}</p>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold text-gray-500">0.0</span>
          </div>
        </div>
      ))}
    </div>
  );
}
