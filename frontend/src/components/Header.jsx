import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, BookOpen, X, Star, Crown } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSearch } from "./SearchContext";

const DEFAULT_AVATAR =
  "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Book Modal ───────────────────────────────────────────────────────────────
function BookModal({ book, onClose }) {
  const navigate = useNavigate();
  const { isSubscribed } = useSearch();

  const handleReadClick = async () => {
    if (!book.isPremium) { navigate(`/read/${book.id}`); onClose(); return; }
    if (isSubscribed) { navigate(`/read/${book.id}`); onClose(); return; }
    toast.error("Buku ini khusus pengguna Premium. Silakan berlangganan.", { id: "premium-toast" });
    navigate("/subscription");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-[#F9F7F4] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 md:hidden bg-white/80 p-1.5 rounded-full text-stone-700">
          <X size={20} />
        </button>
        <div className="w-full md:w-2/5 bg-stone-200 relative aspect-[3/4] md:aspect-auto">
          <img
            src={book.coverURL || "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
        </div>
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
          <div>
            <div className="hidden md:flex justify-end -mt-2 -mr-2 mb-2">
              <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition"><X size={24} /></button>
            </div>
            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest text-[#B49E88] uppercase">
                {book.category?.name || book.categoryName || "Kategori Umum"}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A3F35] leading-tight mb-2">{book.title}</h2>
            <p className="text-stone-500 font-medium mb-4">
              Oleh <span className="text-[#1a7a8a]">{book.author}</span>
            </p>
            <div className="mb-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${book.isPremium ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                {book.isPremium ? (<><Star size={12} className="fill-amber-500 text-amber-500" /> Akses Premium</>) : "Baca Gratis"}
              </span>
            </div>
            <div className="prose prose-sm text-stone-600 mb-8 line-clamp-6">
              <p>{book.description || "Buku ini tidak memiliki deskripsi. Mari mulai membaca untuk mengetahui isinya secara langsung."}</p>
            </div>
          </div>
          <div className="mt-auto pt-4">
            <button
              onClick={handleReadClick}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-2 ${book.isPremium ? "bg-[#B49E88]" : "bg-[#1a7a8a]"}`}
            >
              <BookOpen size={20} />
              {book.isPremium ? "Baca Buku Premium" : "Baca Sekarang"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export default function Header() {
  const navigate = useNavigate();
  const { user, userLoading, isSubscribed, setSearchResults, setSearchQuery, searchResults } = useSearch();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 350);
  const wrapperRef = useRef(null);

  const fetchBooks = useCallback(async (query) => {
    if (!query.trim()) return [];
    const [byTitle, byAuthor, byCategory] = await Promise.allSettled([
      axios.get("/api/books/search", { params: { title: query } }),
      axios.get("/api/books/search", { params: { author: query } }),
      axios.get("/api/books/search", { params: { category: query } }),
    ]);
    const all = [];
    [byTitle, byAuthor, byCategory].forEach((res) => {
      if (res.status === "fulfilled") all.push(...(res.value.data?.data ?? []));
    });
    const seen = new Set();
    return all.filter((b) => { if (seen.has(b.id)) return false; seen.add(b.id); return true; });
  }, []);

  // Live suggestions
  useEffect(() => {
    if (!debouncedSearch.trim()) { setSuggestions([]); setShowDropdown(false); return; }
    let cancelled = false;
    const run = async () => {
      setIsFetching(true);
      const books = await fetchBooks(debouncedSearch);
      if (!cancelled) { setSuggestions(books.slice(0, 6)); setShowDropdown(true); setIsFetching(false); }
    };
    run();
    return () => { cancelled = true; };
  }, [debouncedSearch, fetchBooks]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = async (e) => {
    if (e.key !== "Enter" || !searchTerm.trim()) return;
    setShowDropdown(false);
    setSearchQuery(searchTerm);
    setSearchResults("loading");
    const books = await fetchBooks(searchTerm);
    setSearchResults(books);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowDropdown(false);
    if (searchResults !== null) { setSearchResults(null); setSearchQuery(""); }
  };

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-stone-100 relative z-40">
        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto" ref={wrapperRef}>
          <div className="relative">
            {isFetching ? (
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-[#A3846B] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              className="w-full pl-12 pr-10 py-3 bg-[#F9F7F4] text-stone-700 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A3846B]/50 transition-all shadow-inner placeholder:text-stone-400"
            />

            {searchTerm && (
              <button onClick={handleClear} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                <X size={16} />
              </button>
            )}

            {/* Dropdown */}
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
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Saran ({suggestions.length})</p>
                      <p className="text-[10px] text-stone-400">
                        Tekan <kbd className="bg-stone-100 px-1 py-0.5 rounded text-stone-500">Enter</kbd> untuk lihat semua
                      </p>
                    </div>
                    <ul className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                      {suggestions.map((book) => (
                        <li key={book.id}>
                          <button
                            onClick={() => { setShowDropdown(false); setSelectedBook(book); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F9F7F4] transition-colors text-left group"
                          >
                            <div className="w-9 h-12 rounded-md overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                              {book.coverURL
                                ? <img src={book.coverURL} alt={book.title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                                : <div className="w-full h-full flex items-center justify-center"><BookOpen size={14} className="text-stone-300" /></div>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-stone-800 truncate group-hover:text-[#A3846B] transition-colors">{book.title}</p>
                              <p className="text-xs text-stone-500 truncate mt-0.5">
                                {book.author}
                                {book.category?.name && <span className="ml-2 text-[#A3846B]">· {book.category.name}</span>}
                              </p>
                            </div>
                            {book.isPremium && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">Premium</span>
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

        {/* User Profile */}
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
              {/* Premium indicator dot on avatar */}
              {isSubscribed && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                  <Crown size={8} className="text-amber-900" />
                </span>
              )}
            </div>

            {/* Name + badge */}
            <div className="flex flex-col items-start">
              {userLoading ? (
                <div className="w-20 h-3.5 bg-stone-200 rounded animate-pulse" />
              ) : (
                <span className="text-sm font-semibold text-[#5D4037] group-hover:text-[#A3846B] transition-colors leading-tight">
                  {user?.username ?? "..."}
                </span>
              )}

              {/* Subscription badge */}
              {!userLoading && (
                <span className={`text-[10px] font-bold leading-tight mt-0.5 ${isSubscribed ? "text-amber-600" : "text-stone-400"}`}>
                  {isSubscribed ? "✦ Premium" : "Free"}
                </span>
              )}
            </div>
          </Link>
        </div>
      </header>

      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </>
  );
}