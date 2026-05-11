/**
 * @file components/BookModal.jsx
 * @description Modal detail buku yang digunakan di HomePage, hasil pencarian, dan Header.
 *
 * Menampilkan cover, judul, penulis, kategori, deskripsi, dan tombol baca.
 * Menangani logika akses premium: cek status langganan sebelum navigasi ke reader.
 *
 * @example
 * <BookModal
 *   book={selectedBook}
 *   onClose={() => setSelectedBook(null)}
 *   isSubscribed={isSubscribed}  // opsional, jika tidak dipass akan cek ke API
 * />
 */

import { useNavigate } from "react-router-dom";
import { BookOpen, Star, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

/**
 * Modal detail buku dengan akses kontrol premium.
 *
 * @param {Object} props
 * @param {Object} props.book - Data buku yang akan ditampilkan
 * @param {function} props.onClose - Callback saat modal ditutup
 * @param {boolean} [props.isSubscribed] - Status langganan user.
 *   Jika tidak dipass, modal akan cek ke API /api/userSubs/status secara otomatis.
 */
export default function BookModal({ book, onClose, isSubscribed }) {
  const navigate = useNavigate();

  /**
   * Handle klik tombol baca.
   * - Buku gratis: langsung navigasi ke reader
   * - Buku premium + isSubscribed diketahui: cek dari prop
   * - Buku premium + isSubscribed tidak diketahui: cek ke API
   */
  const handleReadClick = async () => {
    // Buku gratis — langsung baca
    if (!book.isPremium) {
      navigate(`/read/${book.id}`);
      onClose();
      return;
    }

    // Status langganan sudah diketahui dari prop
    if (isSubscribed !== undefined) {
      if (isSubscribed) {
        navigate(`/read/${book.id}`);
        onClose();
      } else {
        toast.error("Buku ini khusus pengguna Premium. Silakan berlangganan.", {
          id: "premium-toast",
        });
        navigate("/subscription");
        onClose();
      }
      return;
    }

    // Fallback: cek status langganan ke API
    try {
      const response = await axios.get("/api/userSubs/status");
      if (response.data.success) {
        const active = response.data.data.active;
        if (active) {
          navigate(`/read/${book.id}`);
          onClose();
        } else {
          toast.error(
            "Buku ini khusus pengguna Premium. Silakan berlangganan.",
            { id: "premium-toast" }
          );
          navigate("/subscription");
          onClose();
        }
      }
    } catch {
      toast.error(
        "Gagal memeriksa status langganan. Pastikan kamu sudah login.",
        { id: "status-error" }
      );
    }
  };

  // Ambil nama kategori dari berbagai kemungkinan struktur data
  const categoryName =
    book.category?.name ||
    book.category?.nameCategory ||
    book.categoryName ||
    "Kategori Umum";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-[#F9F7F4] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Tombol close (mobile) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 md:hidden bg-white/80 p-1.5 rounded-full text-stone-700"
        >
          <X size={20} />
        </button>

        {/* Cover buku */}
        <div className="w-full md:w-2/5 bg-stone-200 relative aspect-[3/4] md:aspect-auto">
          <img
            src={
              book.coverURL ||
              "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"
            }
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          {/* Gradient overlay untuk mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
        </div>

        {/* Info buku */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
          <div>
            {/* Tombol close (desktop) */}
            <div className="hidden md:flex justify-end -mt-2 -mr-2 mb-2">
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Kategori */}
            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest text-[#B49E88] uppercase">
                {categoryName}
              </span>
            </div>

            {/* Judul */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A3F35] leading-tight mb-2">
              {book.title}
            </h2>

            {/* Penulis */}
            <p className="text-stone-500 font-medium mb-4">
              Oleh <span className="text-[#1a7a8a]">{book.author}</span>
            </p>

            {/* Badge premium/gratis */}
            <div className="mb-6">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  book.isPremium
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {book.isPremium ? (
                  <>
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    Akses Premium
                  </>
                ) : (
                  "Baca Gratis"
                )}
              </span>
            </div>

            {/* Deskripsi */}
            <div className="prose prose-sm text-stone-600 mb-8 line-clamp-6">
              <p>
                {book.description ||
                  "Buku ini tidak memiliki deskripsi. Mari mulai membaca untuk mengetahui isinya secara langsung."}
              </p>
            </div>
          </div>

          {/* Tombol baca */}
          <div className="mt-auto pt-4">
            <button
              onClick={handleReadClick}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-2 ${
                book.isPremium ? "bg-[#B49E88]" : "bg-[#1a7a8a]"
              }`}
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
