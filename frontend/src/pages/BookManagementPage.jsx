import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, RefreshCw, Search, AlertCircle, X } from "lucide-react";

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
    <div className="group relative flex flex-col bg-[#F9F8F6] border border-[#D9CFC7] rounded-lg overflow-hidden hover:border-[#C9B59C] hover:shadow-md transition-all duration-200">
      {/* Cover area */}
      <div
        className={`relative h-32 flex items-center justify-center ${
          book.isPremium ? "bg-[#EFE9E3]" : "bg-[#F9F8F6]"
        }`}
      >
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
              ? "bg-[#C9B59C] text-white"
              : "bg-[#D9CFC7] text-gray-700"
          }`}
        >
          {book.isPremium ? "Premium" : "Gratis"}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-0.5">
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          {catLabel}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{book.author}</p>
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

      {/* Actions */}
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
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
        dragging
          ? "border-[#C9B59C] bg-[#EFE9E3]"
          : "border-[#D9CFC7] hover:border-[#C9B59C] hover:bg-[#EFE9E3]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => { if (e.target.files[0]) onChange(e.target.files[0]); }}
      />
      <svg className="w-8 h-8 text-[#D9CFC7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" />
      </svg>
      {displayName ? (
        <p className="text-xs font-medium text-gray-700 text-center break-all px-2">{displayName}</p>
      ) : (
        <>
          <p className="text-sm text-gray-500">Klik atau seret file PDF ke sini</p>
          <p className="text-xs text-gray-400">Hanya format .pdf</p>
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
        checked ? "bg-[#C9B59C]" : "bg-[#D9CFC7]"
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
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm border border-[#D9CFC7] rounded bg-white text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition disabled:bg-gray-100";

// ─── Book Form Modal ──────────────────────────────────────────────────────────
function BookModal({ initial, onClose, onSuccess }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial ? { ...initial, bookFile: null } : { ...EMPTY_FORM });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
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
        await axios.put(`${BASE_URL}/api/books/${initial.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${BASE_URL}/api/books`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Terjadi kesalahan, coba lagi.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#F9F8F6] rounded-lg shadow-xl w-full max-w-lg border border-[#D9CFC7] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#D9CFC7] bg-[#EFE9E3]">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isEdit ? "Edit Buku" : "Tambah Buku Baru"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEdit ? `Mengubah: ${initial.title}` : "Isi semua kolom wajib untuk menyimpan"}
            </p>
          </div>
          <button onClick={onClose} disabled={loading} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-4">
          <Field label="File PDF Buku" required={!isEdit}>
            <UploadZone
              file={form.bookFile}
              onChange={(f) => set("bookFile", f)}
              existingFileName={isEdit ? initial.fileURL?.split("/").pop() : null}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="ID Buku" required hint="Maks. 50 karakter">
              <input
                className={inputCls}
                placeholder="Cth: BOOK-001"
                maxLength={50}
                value={form.id}
                disabled={isEdit || loading}
                onChange={(e) => set("id", e.target.value)}
              />
            </Field>
            <Field label="Kategori" required>
              <select
                className={inputCls}
                value={form.category}
                disabled={loading}
                onChange={(e) => set("category", Number(e.target.value))}
              >
                <option value="">Pilih kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Judul" required>
            <input className={inputCls} placeholder="Judul buku" value={form.title} disabled={loading} onChange={(e) => set("title", e.target.value)} />
          </Field>

          <Field label="Penulis" required hint="Maks. 100 karakter">
            <input className={inputCls} placeholder="Nama penulis" maxLength={100} value={form.author} disabled={loading} onChange={(e) => set("author", e.target.value)} />
          </Field>

          <Field label="Deskripsi">
            <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Deskripsi singkat buku..." value={form.description} disabled={loading} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <Field label="URL Cover">
            <input className={inputCls} placeholder="https://..." type="url" value={form.coverURL} disabled={loading} onChange={(e) => set("coverURL", e.target.value)} />
          </Field>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-700">Konten Premium</p>
              <p className="text-xs text-gray-500">Buku hanya dapat diakses pengguna premium</p>
            </div>
            <Toggle checked={form.isPremium} onChange={(v) => set("isPremium", v)} />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2.5">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 flex justify-end gap-3 border-t border-[#D9CFC7] px-6 pb-5 bg-[#F9F8F6]">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-[#D9CFC7] text-gray-600 rounded hover:bg-[#EFE9E3] transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#C9B59C] text-white rounded hover:bg-[#b09b82] transition-colors shadow-sm disabled:opacity-50 min-w-[120px]"
          >
            {loading ? "Proses..." : isEdit ? "Simpan Perubahan" : "Tambah Buku"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirm({ bookTitle, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F9F8F6] rounded-lg shadow-xl w-full max-w-sm border border-[#D9CFC7] overflow-hidden text-center">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Hapus Buku</h2>
          <p className="text-gray-600 text-sm">
            Apakah kamu yakin ingin menghapus <span className="font-medium text-gray-800">"{bookTitle}"</span>? Data yang dihapus tidak bisa dikembalikan.
          </p>
        </div>
        <div className="bg-[#EFE9E3] p-4 flex justify-center gap-3 border-t border-[#D9CFC7]">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-[#D9CFC7] bg-white text-gray-600 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 min-w-[100px]"
          >
            {loading ? "Proses..." : "Hapus Buku"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, accent }) {
  return (
    <div className={`flex flex-col gap-1 rounded-lg px-4 py-3 bg-[#EFE9E3] border ${accent ? "border-[#C9B59C]" : "border-[#D9CFC7]"}`}>
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-2xl font-bold text-gray-800">{value}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManagementBookPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [tabFilter, setTabFilter] = useState("all");

  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await axios.get(`${BASE_URL}/api/books`);
      setBooks(res.data?.data ?? res.data ?? []);
    } catch {
      setFetchError("Gagal memuat data buku. Periksa koneksi ke server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useState(() => { fetchBooks(); }, []);

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

  const filtered = books.filter((b) => {
    if (tabFilter === "premium" && !b.isPremium) return false;
    if (tabFilter === "free" && b.isPremium) return false;
    if (catFilter && String(b.category) !== catFilter) return false;
    const q = search.toLowerCase();
    if (q && !b.title?.toLowerCase().includes(q) && !b.author?.toLowerCase().includes(q)) return false;
    return true;
  });

  const totalPremium = books.filter((b) => b.isPremium).length;
  const totalFree = books.length - totalPremium;

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans">
      <div className="max-w-6xl mx-auto p-6 md:p-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Buku</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola koleksi buku digital TeBuDi.</p>
          </div>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="bg-[#C9B59C] hover:bg-[#b09b82] text-white px-5 py-2.5 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            <span>Tambah Buku Baru</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Total Buku" value={books.length} />
          <StatCard label="Premium" value={totalPremium} accent />
          <StatCard label="Gratis" value={totalFree} />
        </div>

        {/* Tabs */}
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

        {/* Search & Filter */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul atau penulis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#D9CFC7] rounded bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-[#D9CFC7] rounded bg-white text-gray-700 focus:outline-none focus:border-[#C9B59C] transition"
          >
            <option value="">Semua kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={String(c.value)}>{c.label}</option>
            ))}
          </select>
          <button
            onClick={fetchBooks}
            title="Refresh"
            className="px-3 py-2 border border-[#D9CFC7] rounded bg-white text-gray-500 hover:bg-[#EFE9E3] hover:text-gray-800 transition"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9B59C]"></div>
          </div>
        ) : fetchError ? (
          <div className="bg-[#EFE9E3] rounded-lg border border-[#D9CFC7] p-8 text-center">
            <p className="text-sm text-red-500 mb-3">{fetchError}</p>
            <button
              onClick={fetchBooks}
              className="text-sm px-4 py-2 border border-[#D9CFC7] rounded hover:bg-[#F9F8F6] transition"
            >
              Coba lagi
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#EFE9E3] rounded-lg border border-[#D9CFC7] p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-[#D9CFC7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
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
                onDelete={(id) => setDeleteTarget(books.find((b) => b.id === id))}
              />
            ))}
          </div>
        )}
      </div>

      {modal && (
        <BookModal
          initial={modal.mode === "edit" ? modal.book : null}
          onClose={() => setModal(null)}
          onSuccess={fetchBooks}
        />
      )}

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