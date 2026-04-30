import { useState, useRef, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const CATEGORIES = [
  { value: 1, label: "Fiksi" },
  { value: 2, label: "Non-Fiksi" },
  { value: 3, label: "Sains" },
  { value: 4, label: "Teknologi" },
  { value: 5, label: "Sejarah" },
];

const EMPTY_FORM = {
  id: "",
  category: "",
  title: "",
  author: "",
  description: "",
  coverURL: "",
  isPremium: false,
  bookFile: null,
};

// ─── Book Card ────────────────────────────────────────────────────────────────
function BookCard({ book, onEdit, onDelete }) {
  const catLabel =
    CATEGORIES.find((c) => c.value === book.category)?.label ?? "—";

  return (
    <div className="group relative flex flex-col bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-stone-400 hover:shadow-md transition-all duration-200">
      {/* Cover area */}
      <div
        className={`relative h-32 flex items-center justify-center ${
          book.isPremium ? "bg-amber-50" : "bg-emerald-50"
        }`}
      >
        <svg
          className="w-10 h-10 text-stone-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>

        {book.coverURL && (
          <img
            src={book.coverURL}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}

        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            book.isPremium
              ? "bg-amber-200 text-amber-800"
              : "bg-emerald-200 text-emerald-800"
          }`}
        >
          {book.isPremium ? "Premium" : "Gratis"}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-0.5">
        <p className="text-xs text-stone-400 font-medium tracking-wide uppercase">
          {catLabel}
        </p>
        <h3 className="text-sm font-semibold text-stone-800 leading-tight line-clamp-2">
          {book.title}
        </h3>
        <p className="text-xs text-stone-500 mt-0.5 truncate">{book.author}</p>
        {book.fileURL && (
          <a
            href={`${BASE_URL}/files/${book.fileURL}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 text-[10px] text-sky-600 hover:underline truncate"
          >
            Lihat PDF ↗
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex border-t border-stone-100">
        <button
          onClick={() => onEdit(book)}
          className="flex-1 py-2 text-xs text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
        >
          Edit
        </button>
        <div className="w-px bg-stone-100" />
        <button
          onClick={() => onDelete(book.id)}
          className="flex-1 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ file, onChange, existingFileName }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f?.type === "application/pdf") onChange(f);
    },
    [onChange]
  );

  const displayName = file
    ? file.name
    : existingFileName
    ? `File saat ini: ${existingFileName}`
    : null;

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
        dragging
          ? "border-stone-500 bg-stone-50"
          : "border-stone-200 hover:border-stone-400 hover:bg-stone-50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) onChange(e.target.files[0]);
        }}
      />

      <svg
        className="w-8 h-8 text-stone-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" />
      </svg>

      {displayName ? (
        <p className="text-xs font-medium text-stone-700 text-center break-all px-2">
          {displayName}
        </p>
      ) : (
        <>
          <p className="text-sm text-stone-500">
            Klik atau seret file PDF ke sini
          </p>
          <p className="text-xs text-stone-400">Hanya format .pdf</p>
        </>
      )}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-amber-500" : "bg-stone-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function Field({ label, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-300 transition";

// ─── Modal ────────────────────────────────────────────────────────────────────
function BookModal({ initial, onClose, onSuccess }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    initial
      ? { ...initial, bookFile: null }
      : { ...EMPTY_FORM }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    // Client-side validation
    if (!form.id.trim()) return setError("ID Buku wajib diisi.");
    if (!form.category) return setError("Kategori wajib dipilih.");
    if (!form.title.trim()) return setError("Judul wajib diisi.");
    if (!form.author.trim()) return setError("Penulis wajib diisi.");
    if (!isEdit && !form.bookFile) return setError("File PDF wajib diunggah.");

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (form.bookFile) formData.append("bookFile", form.bookFile);
      formData.append("id", form.id.trim());
      formData.append("category", form.category);
      formData.append("title", form.title.trim());
      formData.append("author", form.author.trim());
      if (form.description) formData.append("description", form.description);
      if (form.coverURL) formData.append("coverURL", form.coverURL);
      formData.append("isPremium", form.isPremium);

      if (isEdit) {
        // PUT /api/books/{id}
        await axios.put(`${BASE_URL}/api/books/${initial.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // POST /api/books
        await axios.post(`${BASE_URL}/api/books`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Terjadi kesalahan, coba lagi.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              {isEdit ? "Edit buku" : "Tambah buku baru"}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {isEdit
                ? `Mengubah: ${initial.title}`
                : "Isi semua kolom wajib untuk menyimpan"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {/* File upload */}
          <Field label="File PDF Buku" required={!isEdit}>
            <UploadZone
              file={form.bookFile}
              onChange={(f) => set("bookFile", f)}
              existingFileName={
                isEdit ? initial.fileURL?.split("/").pop() : null
              }
            />
          </Field>

          {/* ID + Category */}
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="ID Buku"
              required
              hint="Maks. 50 karakter"
            >
              <input
                className={inputCls}
                placeholder="Cth: BOOK-001"
                maxLength={50}
                value={form.id}
                disabled={isEdit}
                onChange={(e) => set("id", e.target.value)}
              />
            </Field>

            <Field label="Kategori" required>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => set("category", Number(e.target.value))}
              >
                <option value="">Pilih kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Title */}
          <Field label="Judul" required>
            <input
              className={inputCls}
              placeholder="Judul buku"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>

          {/* Author */}
          <Field label="Penulis" required hint="Maks. 100 karakter">
            <input
              className={inputCls}
              placeholder="Nama penulis"
              maxLength={100}
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
            />
          </Field>

          {/* Description */}
          <Field label="Deskripsi">
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="Deskripsi singkat buku..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          {/* Cover URL */}
          <Field label="URL Cover">
            <input
              className={inputCls}
              placeholder="https://..."
              type="url"
              value={form.coverURL}
              onChange={(e) => set("coverURL", e.target.value)}
            />
          </Field>

          {/* Premium toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-stone-800">Konten premium</p>
              <p className="text-xs text-stone-400">
                Buku hanya dapat diakses pengguna premium
              </p>
            </div>
            <Toggle
              checked={form.isPremium}
              onChange={(v) => set("isPremium", v)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zm.75 7a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-stone-100 bg-stone-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah buku"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ bookTitle, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-base font-bold text-stone-900">Hapus buku?</h3>
          <p className="text-sm text-stone-500 mt-1">
            <span className="font-medium text-stone-700">"{bookTitle}"</span> akan dihapus permanen dan tidak dapat dikembalikan.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <div className={`flex flex-col gap-1 rounded-xl px-4 py-3 ${color}`}>
      <span className="text-xs font-medium text-stone-500">{label}</span>
      <span className="text-2xl font-bold text-stone-800">{value}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManagementBookPage() {
  // ── State ─────────────────────────────────
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [tabFilter, setTabFilter] = useState("all"); // all | premium | free

  const [modal, setModal] = useState(null); // null | { mode: "add" } | { mode: "edit", book }
  const [deleteTarget, setDeleteTarget] = useState(null); // null | book object
  const [deleting, setDeleting] = useState(false);

  // ── Fetch books ───────────────────────────
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await axios.get(`${BASE_URL}/api/books`);
      // Sesuaikan dengan struktur ApiResponseDTO<List<BookResponseDTO>>
      setBooks(res.data?.data ?? res.data ?? []);
    } catch {
      setFetchError("Gagal memuat data buku. Periksa koneksi ke server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useState(() => {
    fetchBooks();
  }, []);

  // ── Delete ────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/books/${deleteTarget.id}`);
      await fetchBooks();
      setDeleteTarget(null);
    } catch {
      alert("Gagal menghapus buku. Coba lagi.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Filter & Search ───────────────────────
  const filtered = books.filter((b) => {
    if (tabFilter === "premium" && !b.isPremium) return false;
    if (tabFilter === "free" && b.isPremium) return false;
    if (catFilter && String(b.category) !== catFilter) return false;
    const q = search.toLowerCase();
    if (q && !b.title?.toLowerCase().includes(q) && !b.author?.toLowerCase().includes(q))
      return false;
    return true;
  });

  const totalPremium = books.filter((b) => b.isPremium).length;
  const totalFree = books.length - totalPremium;

  // ── Render ────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Manajemen Buku
            </h1>
            <p className="text-sm text-stone-400 mt-0.5">
              Kelola koleksi buku digital TeBuDi
            </p>
          </div>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-700 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M8 2v12M2 8h12" strokeLinecap="round" />
            </svg>
            Tambah Buku
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Total buku" value={books.length} color="bg-white border border-stone-200" />
          <StatCard label="Premium" value={totalPremium} color="bg-amber-50 border border-amber-100" />
          <StatCard label="Gratis" value={totalFree} color="bg-emerald-50 border border-emerald-100" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-stone-200">
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
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-400 hover:text-stone-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-5">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="6.5" cy="6.5" r="4.5" />
              <path d="M10.5 10.5l3 3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Cari judul atau penulis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg bg-white text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white text-stone-700 focus:outline-none focus:border-stone-400 transition"
          >
            <option value="">Semua kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={String(c.value)}>
                {c.label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchBooks}
            title="Refresh"
            className="px-3 py-2 border border-stone-200 rounded-lg bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-800 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1.5 8A6.5 6.5 0 1114 8" strokeLinecap="round"/>
              <path d="M14 4v4h-4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-stone-400 text-sm gap-2">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Memuat data...
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-sm text-red-500">{fetchError}</p>
            <button
              onClick={fetchBooks}
              className="text-sm px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition"
            >
              Coba lagi
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-400">
            <svg className="w-12 h-12 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
            <p className="text-sm">
              {search || catFilter ? "Tidak ada buku yang cocok." : "Belum ada buku. Tambahkan buku pertama!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={(b) => setModal({ mode: "edit", book: b })}
                onDelete={(id) =>
                  setDeleteTarget(books.find((b) => b.id === id))
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <BookModal
          initial={modal.mode === "edit" ? modal.book : null}
          onClose={() => setModal(null)}
          onSuccess={fetchBooks}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteConfirm
          bookTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}