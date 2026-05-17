/**
 * @file components/book/BookFormModal.jsx
 * @description Modal form untuk tambah dan edit buku (admin).
 * Menangani upload file PDF, validasi form, dan submit ke API.
 *
 * @example
 * // Tambah buku baru
 * <BookFormModal categories={categories} onClose={() => setModal(null)} onSuccess={fetchData} />
 *
 * // Edit buku
 * <BookFormModal initial={book} categories={categories} onClose={() => setModal(null)} onSuccess={fetchData} />
 */

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import Field, { inputCls } from "../ui/Field";
import Toggle from "../ui/Toggle";
import UploadZone from "./UploadZone";
import { createBook, updateBook } from "../../services/bookService";

/** Nilai awal form kosong untuk mode tambah */
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

/**
 * Modal form tambah/edit buku.
 *
 * @param {Object} props
 * @param {Object|null} [props.initial=null] - Data buku awal (null = mode tambah, object = mode edit)
 * @param {Array} props.categories - Daftar kategori untuk dropdown
 * @param {function} props.onClose - Callback saat modal ditutup
 * @param {function} props.onSuccess - Callback setelah berhasil simpan (untuk refresh data)
 */
export default function BookFormModal({ initial = null, onClose, onSuccess, categories }) {
  const isEdit = !!initial;

  // Inisialisasi form: mode edit pakai data buku, mode tambah pakai form kosong
  // Normalisasi field category: API return categoryId (integer), entity lama return category (object)
  const normalizeCategoryId = (data) => {
    if (!data) return "";
    // BookResponseDTO pakai categoryId
    if (data.categoryId != null) return data.categoryId;
    // Entity Book pakai category sebagai object
    if (data.category != null) {
      if (typeof data.category === "object") return data.category.idCategory ?? data.category.id ?? "";
      return data.category;
    }
    return "";
  };

  const [form, setForm] = useState(
    initial
      ? { ...initial, category: normalizeCategoryId(initial), bookFile: null }
      : { ...EMPTY_FORM }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Helper untuk update satu field form */
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  /**
   * Validasi dan submit form ke API.
   * Menggunakan FormData untuk mendukung upload file PDF.
   */
  const handleSubmit = async () => {
    // Validasi field wajib
    if (!form.id.trim()) return setError("ID Buku wajib diisi.");
    if (!form.category) return setError("Kategori wajib dipilih.");
    if (!form.title.trim()) return setError("Judul wajib diisi.");
    if (!form.author.trim()) return setError("Penulis wajib diisi.");
    if (!isEdit && !form.bookFile) return setError("File PDF wajib diunggah.");

    setLoading(true);
    setError(null);

    try {
      // Bangun FormData untuk multipart upload
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
        await updateBook(initial.id, formData);
      } else {
        await createBook(formData);
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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#F9F8F6] rounded-lg shadow-xl w-full max-w-lg border border-[#D9CFC7] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header modal */}
        <div className="flex justify-between items-center p-4 border-b border-[#D9CFC7] bg-[#EFE9E3]">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isEdit ? "Edit Buku" : "Tambah Buku Baru"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEdit
                ? `Mengubah: ${initial.title}`
                : "Isi semua kolom wajib untuk menyimpan"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body form */}
        <div className="overflow-y-auto p-6 flex flex-col gap-4">
          {/* Upload PDF */}
          <Field label="File PDF Buku" required={!isEdit}>
            <UploadZone
              file={form.bookFile}
              onChange={(f) => set("bookFile", f)}
              existingFileName={isEdit ? initial.fileURL?.split("/").pop() : null}
            />
          </Field>

          {/* ID dan Kategori */}
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
                {categories.map((c) => (
                  <option key={c.idCategory} value={c.idCategory}>
                    {c.nameCategory}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Judul */}
          <Field label="Judul" required>
            <input
              className={inputCls}
              placeholder="Judul buku"
              value={form.title}
              disabled={loading}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>

          {/* Penulis */}
          <Field label="Penulis" required hint="Maks. 100 karakter">
            <input
              className={inputCls}
              placeholder="Nama penulis"
              maxLength={100}
              value={form.author}
              disabled={loading}
              onChange={(e) => set("author", e.target.value)}
            />
          </Field>

          {/* Deskripsi */}
          <Field label="Deskripsi">
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="Deskripsi singkat buku..."
              value={form.description}
              disabled={loading}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          {/* URL Cover */}
          <Field label="URL Cover">
            <input
              className={inputCls}
              placeholder="https://..."
              type="url"
              value={form.coverURL}
              disabled={loading}
              onChange={(e) => set("coverURL", e.target.value)}
            />
          </Field>

          {/* Toggle Premium */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-700">Konten Premium</p>
              <p className="text-xs text-gray-500">
                Buku hanya dapat diakses pengguna premium
              </p>
            </div>
            <Toggle
              checked={form.isPremium}
              onChange={(v) => set("isPremium", v)}
              disabled={loading}
            />
          </div>

          {/* Pesan error */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2.5">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer tombol aksi */}
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
