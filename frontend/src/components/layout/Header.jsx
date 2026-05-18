/**
 * @file components/layout/Header.jsx
 * @description Header utama dashboard dengan fitur pencarian live dan info user.
 *
 * Desktop : search bar lebar + avatar user di kanan
 * Mobile  : tombol hamburger (kiri) + search bar compact + avatar (kanan)
 *
 * @param {Object}   props
 * @param {function} props.onMenuClick - Callback untuk membuka sidebar drawer (mobile)
 */

import { useState, useEffect, useRef } from "react";
import { Search, BookOpen, X, Crown, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { useDebounce } from "../../hooks";
import { searchBooks } from "../../services/bookService";
import BookModal from "../BookModal";

const DEFAULT_AVATAR =
  "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg";

/**
 * Header dashboard.
 * Harus digunakan di dalam SearchProvider (sudah di-wrap oleh DashboardLayout).
 *
 * @param {Object}   props
 * @param {function} props.onMenuClick - Buka sidebar drawer di mobile
 */
export default function Header({ onMenuClick }) {
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

  const debouncedSearch = useDebounce(searchTerm, 350);
  const wrapperRef = useRef(null);

  // Fetch saran pencarian
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
        setSuggestions(books.slice(0, 6));
        setShowDropdown(true);
        setIsFetching(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [debouncedSearch]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = async (e) => {
    if (e.key !== "Enter" || !searchTerm.trim()) return;
    setShowDropdown(false);
    setSearchQuery(searchTerm);
    setSearchResults("loading");
    const books = await searchBooks(searchTerm);
    setSearchResults(books);
  };

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
      <header className="flex items-center gap-3 px-4 md:px-8 py-3 bg-white border-b border-stone-100 relative z-40">

        {/* ── Hamburger (mobile only) ── */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex-shrink-0 p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
          aria-label="Buka menu"
        >
          <Menu size={22} />
        </button>

        {/* ── Search bar ── */}
        <div className="flex-1 min-w-0" ref={wrapperRef}>
          <div className="relative">
            {/* Ikon search / spinner */}
            {isFetching ? (
              <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-[#A3846B] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </span>
            ) : (
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4 md:h-5 md:w-5" />
            )}

            <input
              type="text"
              placeholder="Cari judul, penulis, atau kategori…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              className="w-full pl-9 md:pl-12 pr-9 py-2.5 md:py-3 bg-[#F9F7F4] text-stone-700 border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#A3846B]/50 transition-all shadow-inner placeholder:text-stone-400"
            />

            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={15} />
              </button>
            )}

            {/* Dropdown saran */}
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
                      <p className="hidden sm:block text-[10px] text-stone-400">
                        Tekan{" "}
                        <kbd className="bg-stone-100 px-1 py-0.5 rounded text-stone-500">Enter</kbd>{" "}
                        untuk lihat semua
                      </p>
                    </div>
                    <ul className="max-h-64 overflow-y-auto divide-y divide-stone-100">
                      {suggestions.map((book) => (
                        <li key={book.id}>
                          <button
                            onClick={() => { setShowDropdown(false); setSelectedBook(book); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F9F7F4] transition-colors text-left group"
                          >
                            <div className="w-8 h-11 rounded-md overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                              {book.coverURL ? (
                                <img src={book.coverURL} alt={book.title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen size={12} className="text-stone-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-stone-800 truncate group-hover:text-[#A3846B] transition-colors">
                                {book.title}
                              </p>
                              <p className="text-xs text-stone-500 truncate mt-0.5">
                                {book.author}
                                {book.category?.name && (
                                  <span className="ml-2 text-[#A3846B]">· {book.category.name}</span>
                                )}
                              </p>
                            </div>
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

        {/* ── Avatar user ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden md:block h-7 w-px bg-stone-200" />
          <Link
            to="/profile"
            className="flex items-center gap-2 cursor-pointer group p-1 md:p-1.5 md:pr-3 rounded-full hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all no-underline"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {userLoading ? (
                <div className="h-9 w-9 rounded-full bg-stone-200 animate-pulse" />
              ) : (
                <img
                  src={user?.avatarURL || DEFAULT_AVATAR}
                  alt={user?.username ?? "User"}
                  className="h-9 w-9 rounded-full object-cover border-2 border-[#EFE9E2] shadow-sm group-hover:border-[#A3846B] transition-colors"
                />
              )}
              {isSubscribed && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                  <Crown size={8} className="text-amber-900" />
                </span>
              )}
            </div>

            {/* Nama + badge — hanya di md ke atas */}
            <div className="hidden md:flex flex-col items-start">
              {userLoading ? (
                <div className="w-20 h-3.5 bg-stone-200 rounded animate-pulse" />
              ) : (
                <span className="text-sm font-semibold text-[#5D4037] group-hover:text-[#A3846B] transition-colors leading-tight">
                  {user?.username ?? "..."}
                </span>
              )}
              {!userLoading && (
                <span className={`text-[10px] font-bold leading-tight mt-0.5 ${isSubscribed ? "text-amber-600" : "text-stone-400"}`}>
                  {isSubscribed ? "✦ Premium" : "Free"}
                </span>
              )}
            </div>
          </Link>
        </div>
      </header>

      {/* Modal detail buku dari saran pencarian */}
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
