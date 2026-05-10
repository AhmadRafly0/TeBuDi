import Header from "./Header";
import Sidebar from "./Sidebar";
import { SearchProvider, useSearch } from "./SearchContext";
import { useState } from "react";
import { BookOpen, Star, X } from "lucide-react";
import BookModal from "./BookModal";

const colors = { brown: "#B49E88", textDark: "#4A3F35" };

function SearchResultsView() {
  const { searchResults, searchQuery, setSearchResults, setSearchQuery, isSubscribed } = useSearch();
  const [selectedBook, setSelectedBook] = useState(null);

  const isLoading = searchResults === "loading";
  const books = Array.isArray(searchResults) ? searchResults : [];

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.textDark }}>
              Hasil Pencarian
            </h2>
            <p className="text-sm text-stone-500 mt-0.5">
              untuk <span className="font-semibold text-[#B49E88]">&ldquo;{searchQuery}&rdquo;</span>
              {!isLoading && <span> · {books.length} buku ditemukan</span>}
            </p>
          </div>
          <button
            onClick={() => { setSearchResults(null); setSearchQuery(""); }}
            className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X size={15} /> Tutup hasil
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4" style={{ borderColor: colors.brown }} />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-300">
            <BookOpen className="mx-auto mb-3 text-stone-300" size={40} />
            <p className="text-gray-500">Tidak ada buku ditemukan untuk &ldquo;{searchQuery}&rdquo;</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {books.map((book) => (
              <div key={book.id} className="group cursor-pointer" onClick={() => setSelectedBook(book)}>
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 group-hover:-translate-y-2">
                  <img
                    src={book.coverURL || "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm z-10 ${book.isPremium ? "bg-amber-400 text-amber-950" : "bg-emerald-400 text-emerald-950"}`}>
                    {book.isPremium ? "Premium" : "Gratis"}
                  </span>
                  <div className="absolute inset-0 hover:bg-black/50 transition-all flex items-center justify-center">
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

// ─── Inner layout ─────────────────────────────────────────────────────────────
function LayoutInner({ children }) {
  const { searchResults } = useSearch();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-stone-50">
          {searchResults !== null ? <SearchResultsView /> : children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <SearchProvider>
      <LayoutInner>{children}</LayoutInner>
    </SearchProvider>
  );
}