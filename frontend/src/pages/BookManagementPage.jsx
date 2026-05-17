/**
 * @file pages/BookManagementPage.jsx
 * @description Halaman manajemen buku untuk admin.
 *
 * Fitur:
 * - Tampilkan semua buku dalam grid
 * - Filter berdasarkan tab (semua/premium/gratis) dan kategori
 * - Pencarian berdasarkan judul atau penulis
 * - Tambah, edit, dan hapus buku
 * - Statistik ringkasan (total, premium, gratis)
 *
 * Hanya bisa diakses oleh user dengan role "admin" (dijaga oleh AdminRoute).
 */

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Plus, RefreshCw, Search } from "lucide-react";

// Komponen modular
import { BookCard, BookFormModal } from "../components/book";
import { StatCard, DeleteConfirmModal } from "../components/ui";

/**
 * Halaman manajemen buku (admin).
 * Fetch data buku dan kategori secara paralel saat mount.
 */
export default function BookManagementPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // State filter dan pencarian
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [tabFilter, setTabFilter] = useState("all");

  // State modal
  const [modal, setModal] = useState(null); // { mode: "add" | "edit", book?: Object }
  const [deleteTarget, setDeleteTarget] = useState(null); // buku yang akan dihapus
  const [deleting, setDeleting] = useState(false);

  /**
   * Fetch buku dan kategori secara paralel dari API.
   * Dibungkus useCallback agar bisa dipanggil ulang (refresh).
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const [booksRes, categoriesRes] = await Promise.all([
        axios.get("/api/books"),
        axios.get("/api/categories"),
      ]);
      setBooks(booksRes.data?.data ?? booksRes.data ?? []);
      setCategories(categoriesRes.data?.data ?? categoriesRes.data ?? []);
    } catch {
      setFetchError("Gagal memuat data. Periksa koneksi ke server.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Hapus buku yang dipilih dari server, lalu refresh data.
   */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/books/${deleteTarget.id}`);
      await fetchData();
      setDeleteTarget(null);
    } catch {
      alert("Gagal menghapus buku. Coba lagi.");
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Filter buku berdasarkan tab, kategori, dan query pencarian.
   */
  const filtered = books.filter((b) => {
    if (tabFilter === "premium" && !b.isPremium) return false;
    if (tabFilter === "free" && b.isPremium) return false;
    if (catFilter && String(b.categoryId ?? b.category) !== catFilter) return false;
    const q = search.toLowerCase();
    if (
      q &&
      !b.title?.toLowerCase().includes(q) &&
      !b.author?.toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  // Hitung statistik
  const totalPremium = books.filter((b) => b.isPremium).length;
  const totalFree = books.length - totalPremium;

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans">
      <div className="max-w-6xl mx-auto p-6 md:p-10">

        {/* Header halaman */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Buku</h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola koleksi buku digital TeBuDi.
            </p>
          </div>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="bg-[#C9B59C] hover:bg-[#b09b82] text-white px-5 py-2.5 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            <span>Tambah Buku Baru</span>
          </button>
        </div>

        {/* Kartu statistik */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Total Buku" value={books.length} />
          <StatCard label="Premium" value={totalPremium} accent />
          <StatCard label="Gratis" value={totalFree} />
        </div>

        {/* Tab filter */}
        <div className="flex gap-1 mb-4 border-b border-[#D9CFC7]">
          {[
            { key: "all", label: "Semua" },
            { key: "premium", label: "Premium" },
            { key: "free", label: "Gratis" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTabFilter(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tabFilter === t.key
                  ? "border-[#C9B59C] text-gray-800"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search dan filter kategori */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari judul atau penulis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#D9CFC7] rounded bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition"
            />
          </div>
          {/* Dropdown filter kategori (dinamis dari API) */}
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-[#D9CFC7] rounded bg-white text-gray-700 focus:outline-none focus:border-[#C9B59C] transition"
          >
            <option value="">Semua kategori</option>
            {categories.map((c) => (
              <option key={c.idCategory} value={String(c.idCategory)}>
                {c.nameCategory}
              </option>
            ))}
          </select>
          {/* Tombol refresh */}
          <button
            onClick={fetchData}
            title="Refresh"
            className="px-3 py-2 border border-[#D9CFC7] rounded bg-white text-gray-500 hover:bg-[#EFE9E3] hover:text-gray-800 transition"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Konten: loading / error / kosong / grid buku */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9B59C]" />
          </div>
        ) : fetchError ? (
          <div className="bg-[#EFE9E3] rounded-lg border border-[#D9CFC7] p-8 text-center">
            <p className="text-sm text-red-500 mb-3">{fetchError}</p>
            <button
              onClick={fetchData}
              className="text-sm px-4 py-2 border border-[#D9CFC7] rounded hover:bg-[#F9F8F6] transition"
            >
              Coba lagi
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#EFE9E3] rounded-lg border border-[#D9CFC7] p-8 text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-[#D9CFC7]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
            <p className="text-sm">
              {search || catFilter
                ? "Tidak ada buku yang cocok."
                : "Belum ada buku. Tambahkan buku pertama!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                categories={categories}
                onEdit={(b) => setModal({ mode: "edit", book: b })}
                onDelete={(id) =>
                  setDeleteTarget(books.find((b) => b.id === id))
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal tambah/edit buku */}
      {modal && (
        <BookFormModal
          initial={modal.mode === "edit" ? modal.book : null}
          categories={categories}
          onClose={() => setModal(null)}
          onSuccess={fetchData}
        />
      )}

      {/* Modal konfirmasi hapus */}
      {deleteTarget && (
        <DeleteConfirmModal
          title="Hapus Buku"
          itemName={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
