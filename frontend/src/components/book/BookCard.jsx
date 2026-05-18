/**
 * @file components/book/BookCard.jsx
 * @description Kartu buku untuk tampilan grid di halaman admin BookManagementPage.
 * Menampilkan cover, kategori, judul, penulis, dan tombol edit/hapus.
 *
 * @example
 * <BookCard
 *   book={book}
 *   categories={categories}
 *   onEdit={(b) => setModal({ mode: "edit", book: b })}
 *   onDelete={(id) => setDeleteTarget(books.find(b => b.id === id))}
 * />
 */

import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

/**
 * Kartu buku untuk halaman manajemen admin.
 *
 * @param {Object} props
 * @param {Object} props.book - Data buku
 * @param {Array} props.categories - Daftar kategori untuk lookup nama kategori
 * @param {function} props.onEdit - Callback saat tombol edit diklik, menerima object buku
 * @param {function} props.onDelete - Callback saat tombol hapus diklik, menerima id buku
 */
export default function BookCard({ book, categories, onEdit, onDelete }) {
  // Gunakan categoryName dari DTO langsung, fallback ke lookup dari categories array
  const catLabel =
    book.categoryName ||
    categories.find((c) => c.idCategory === (book.categoryId ?? book.category))?.nameCategory ||
    "-";

  return (
    <div className="group relative flex flex-col bg-[#F9F8F6] border border-[#D9CFC7] rounded-lg overflow-hidden hover:border-[#C9B59C] hover:shadow-md transition-all duration-200">
      {/* Area cover buku */}
      <div
        className={`relative h-32 flex items-center justify-center ${
          book.isPremium ? "bg-[#EFE9E3]" : "bg-[#F9F8F6]"
        }`}
      >
        {/* Ikon buku default */}
        <svg
          className="w-10 h-10 text-[#D9CFC7]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>

        {/* Cover image jika tersedia */}
        {book.coverURL && (
          <img
            src={book.coverURL}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}

        {/* Badge premium/gratis */}
        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            book.isPremium
              ? "bg-[#C9B59C] text-white"
              : "bg-[#D9CFC7] text-gray-700"
          }`}
        >
          {book.isPremium ? "Premium" : "Gratis"}
        </span>
      </div>

      {/* Info buku */}
      <div className="flex flex-col flex-1 p-3 gap-0.5">
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          {catLabel}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{book.author}</p>
        {/* Link baca jika file tersedia */}
        {book.fileURL && (
          <Link
            to={`/read/${book.id}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 text-[10px] text-[#C9B59C] hover:underline truncate"
          >
            Mulai Membaca
          </Link>
        )}
      </div>

      {/* Tombol aksi edit dan hapus */}
      <div className="flex border-t border-[#D9CFC7]">
        <button
          onClick={() => onEdit(book)}
          className="flex-1 py-2 text-xs text-gray-600 hover:bg-[#EFE9E3] hover:text-gray-900 transition-colors flex items-center justify-center gap-1"
        >
          <Pencil size={12} /> Edit
        </button>
        <div className="w-px bg-[#D9CFC7]" />
        <button
          onClick={() => onDelete(book.id)}
          className="flex-1 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
        >
          <Trash2 size={12} /> Hapus
        </button>
      </div>
    </div>
  );
}
