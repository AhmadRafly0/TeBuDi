/**
 * @file components/layout/DashboardLayout.jsx
 * @description Layout utama untuk semua halaman dashboard (setelah login).
 *
 * Struktur:
 * - Desktop (lg+) : Sidebar tetap di kiri + konten di kanan
 * - Mobile/Tablet : Sidebar sebagai drawer overlay, dibuka via hamburger di Header
 *
 * Juga menangani tampilan hasil pencarian global yang menimpa konten halaman.
 */

import { useState } from "react";
import { BookOpen, Star, X } from "lucide-react";
import { SearchProvider, useSearch } from "../../context/SearchContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BookModal from "../BookModal";

/**
 * Tampilan hasil pencarian global.
 * Menimpa konten halaman saat ada hasil pencarian aktif.
 */
function SearchResultsView() {
  const {
    searchResults,
    searchQuery,
    setSearchResults,
    setSearchQuery,
    isSubscribed,
  } = useSearch();

  const [selectedBook, setSelectedBook] = useState(null);

  const isLoading = searchResults === "loading";
  const books = Array.isArray(searchResults) ? searchResults : [];

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header hasil pencarian */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#4A3F35]">Hasil Pencarian</h2>
            <p className="text-sm text-stone-500 mt-0.5">
              untuk{" "}
              <span className="font-semibold text-[#B49E88]">
                &ldquo;{searchQuery}&rdquo;
              </span>
              {!isLoading && <span> · {books.length} buku ditemukan</span>}
            </p>
          </div>
          <button
            onClick={() => { setSearchResults(null); setSearchQuery(""); }}
            className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-lg hover:bg-stone-200 transition-colors flex-shrink-0"
          >
            <X size={15} />
            <span className="hidden sm:inline">Tutup hasil</span>
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4" style={{ borderColor: "#B49E88" }} />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-300">
            <BookOpen className="mx-auto mb-3 text-stone-300" size={40} />
            <p className="text-gray-500">
              Tidak ada buku ditemukan untuk &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative aspect-[3/4] mb-3 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 group-hover:-translate-y-2">
                  <img
                    src={book.coverURL || "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm z-10 ${book.isPremium ? "bg-amber-400 text-amber-950" : "bg-emerald-400 text-emerald-950"}`}>
                    {book.isPremium ? "Premium" : "Gratis"}
                  </span>
                  <div className="absolute inset-0 hover:bg-black/50 transition-all flex items-center justify-center">
                    <BookOpen className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
                  </div>
                </div>
                <h3 className="font-bold text-sm leading-tight mb-1 truncate" style={{ color: "#4A3F35" }}>
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 mb-1.5 truncate">{book.author}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold text-gray-600">0.0</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          isSubscribed={isSubscribed}
        />
      )}
    </>
  );
}

/**
 * Inner layout yang mengakses SearchContext.
 */
function LayoutInner({ children }) {
  const { searchResults } = useSearch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      {/* Sidebar (desktop statis + mobile drawer) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Area konten utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {searchResults !== null ? <SearchResultsView /> : children}
        </main>
      </div>
    </div>
  );
}

/**
 * Layout utama dashboard.
 * Membungkus SearchProvider agar Header dan halaman bisa berbagi state pencarian.
 */
export default function DashboardLayout({ children }) {
  return (
    <SearchProvider>
      <LayoutInner>{children}</LayoutInner>
    </SearchProvider>
  );
}
