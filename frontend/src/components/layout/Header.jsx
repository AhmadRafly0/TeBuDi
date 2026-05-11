/**
 * @file components/layout/Header.jsx
 * @description Header utama dashboard dengan fitur pencarian live dan info user.
 *
 * Fitur:
 * - Pencarian buku real-time dengan debounce 350ms
 * - Dropdown saran pencarian (maks. 6 hasil)
 * - Tekan Enter untuk lihat semua hasil di halaman utama
 * - Avatar user dengan indikator premium
 * - Klik avatar → navigasi ke halaman profil
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, BookOpen, X, Star, Crown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSearch } from "../../context/SearchContext";
import { useDebounce } from "../../hooks";
import { searchBooks } from "../../services/bookService";
import BookModal from "../BookModal";

/** URL avatar default jika user belum upload foto profil */
const DEFAULT_AVATAR =
  "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg";

/**
 * Header dashboard dengan search bar dan info user.
 * Harus digunakan di dalam SearchProvider (sudah di-wrap oleh DashboardLayout).
 */
export default function Header() {
  const navigate = useNavigate();
  const {
    user,
    userLoading,
    isSubscribed,
    setSearchResults,
    setSearchQuery,
    searchResults,
  } = useSearch();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  /** Debounce input pencarian 350ms sebelum fetch ke API */
  const debouncedSearch = useDebounce(searchTerm, 350);
  const wrapperRef = useRef(null);

  /**
   * Fetch saran pencarian saat debouncedSearch berubah.
   * Dibatalkan jika komponen unmount atau query berubah lagi.
   */
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setIsFetching(true);
      const books = await searchBooks(debouncedSearch);
      if (!cancelled) {
        setSuggestions(books.slice(0, 6)); // Tampilkan maks. 6 saran
        setShowDropdown(true);
        setIsFetching(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  /**
   * Tutup dropdown saat klik di luar area search.
   */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /**
   * Handle Enter key: fetch semua hasil dan tampilkan di halaman utama.
   */
  const handleKeyDown = async (e) => {
    if (e.key !== "Enter" || !searchTerm.trim()) return;
    setShowDropdown(false);
    setSearchQuery(searchTerm);
    setSearchResults("loading");
    const books = await searchBooks(searchTerm);
    setSearchResults(books);
  };

  /**
   * Bersihkan input dan tutup hasil pencarian.
   */
  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowDropdown(false);
    if (searchResults !== null) {
      setSearchResults(null);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-stone-100 relative z-40">
        {/* Search bar */}
        <div className="flex-1 max-w-xl mx-auto" ref={wrapperRef}>
          <div className="relative">
            {/* Ikon search / spinner loading */}
            {isFetching ? (
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-[#A3846B] animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              </span>
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 h-5 w-5" />
            )}

            <input
              type="text"
              placeholder="Search by title, author, or category…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              className="w-full pl-12 pr-10 py-3 bg-[#F9F7F4] text-stone-700 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A3846B]/50 transition-all shadow-inner placeholder:text-stone-400"
            />

            {/* Tombol clear */}
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}

            {/* Dropdown saran pencarian */}
            {showDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden z-50">
                {suggestions.length === 0 ? (
                  <div className="flex items-center gap-3 px-5 py-4 text-stone-500 text-sm">
                    <Search size={16} className="text-stone-300" />
                    Tidak ada hasil untuk &ldquo;{debouncedSearch}&rdquo;
                  </div>
                ) : (
                  <>
                    <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Saran ({suggestions.length})
                      </p>
                      <p className="text-[10px] text-stone-400">
                        Tekan{" "}
                        <kbd className="bg-stone-100 px-1 py-0.5 rounded text-stone-500">
                          Enter
                        </kbd>{" "}
                        untuk lihat semua
                      </p>
                    </div>
                    <ul className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                      {suggestions.map((book) => (
                        <li key={book.id}>
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              setSelectedBook(book);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F9F7F4] transition-colors text-left group"
                          >
                            {/* Thumbnail cover */}
                            <div className="w-9 h-12 rounded-md overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                              {book.coverURL ? (
                                <img
                                  src={book.coverURL}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) =>
                                    (e.currentTarget.style.display = "none")
                                  }
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen size={14} className="text-stone-300" />
                                </div>
                              )}
                            </div>
                            {/* Info buku */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-stone-800 truncate group-hover:text-[#A3846B] transition-colors">
                                {book.title}
                              </p>
                              <p className="text-xs text-stone-500 truncate mt-0.5">
                                {book.author}
                                {book.category?.name && (
                                  <span className="ml-2 text-[#A3846B]">
                                    · {book.category.name}
                                  </span>
                                )}
                              </p>
                            </div>
                            {/* Badge premium */}
                            {book.isPremium && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">
                                Premium
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info user */}
        <div className="flex items-center gap-4 ml-6">
          <div className="h-8 w-px bg-stone-200" />

          <Link
            to="/profile"
            className="flex items-center gap-3 cursor-pointer group p-1.5 pr-3 rounded-full hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all no-underline"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {userLoading ? (
                <div className="h-10 w-10 rounded-full bg-stone-200 animate-pulse" />
              ) : (
                <img
                  src={user?.avatarURL || DEFAULT_AVATAR}
                  alt={user?.username ?? "User"}
                  className="h-10 w-10 rounded-full object-cover border-2 border-[#EFE9E2] shadow-sm group-hover:border-[#A3846B] transition-colors"
                />
              )}
              {/* Indikator premium di avatar */}
              {isSubscribed && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                  <Crown size={8} className="text-amber-900" />
                </span>
              )}
            </div>

            {/* Nama dan badge langganan */}
            <div className="flex flex-col items-start">
              {userLoading ? (
                <div className="w-20 h-3.5 bg-stone-200 rounded animate-pulse" />
              ) : (
                <span className="text-sm font-semibold text-[#5D4037] group-hover:text-[#A3846B] transition-colors leading-tight">
                  {user?.username ?? "..."}
                </span>
              )}
              {!userLoading && (
                <span
                  className={`text-[10px] font-bold leading-tight mt-0.5 ${
                    isSubscribed ? "text-amber-600" : "text-stone-400"
                  }`}
                >
                  {isSubscribed ? "✦ Premium" : "Free"}
                </span>
              )}
            </div>
          </Link>
        </div>
      </header>

      {/* Modal detail buku dari hasil pencarian */}
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
