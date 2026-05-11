/**
 * @file components/book/UploadZone.jsx
 * @description Area upload file PDF dengan dukungan drag-and-drop.
 * Digunakan di BookFormModal untuk upload file buku.
 *
 * @example
 * <UploadZone
 *   file={form.bookFile}
 *   onChange={(f) => setForm(prev => ({ ...prev, bookFile: f }))}
 *   existingFileName="buku-lama.pdf"
 * />
 */

import { useRef, useState, useCallback } from "react";

/**
 * Area upload file PDF dengan drag-and-drop.
 *
 * @param {Object} props
 * @param {File|null} props.file - File yang sudah dipilih (null jika belum ada)
 * @param {function} props.onChange - Callback saat file dipilih, menerima object File
 * @param {string|null} [props.existingFileName] - Nama file yang sudah ada (mode edit)
 */
export default function UploadZone({ file, onChange, existingFileName }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  /**
   * Handle drop event — validasi tipe file PDF sebelum memanggil onChange.
   */
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f?.type === "application/pdf") onChange(f);
    },
    [onChange]
  );

  // Nama yang ditampilkan: file baru > file lama > null
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
      className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
        dragging
          ? "border-[#C9B59C] bg-[#EFE9E3]"
          : "border-[#D9CFC7] hover:border-[#C9B59C] hover:bg-[#EFE9E3]"
      }`}
    >
      {/* Input file tersembunyi */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) onChange(e.target.files[0]);
        }}
      />

      {/* Ikon upload */}
      <svg
        className="w-8 h-8 text-[#D9CFC7]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" />
      </svg>

      {/* Nama file atau placeholder */}
      {displayName ? (
        <p className="text-xs font-medium text-gray-700 text-center break-all px-2">
          {displayName}
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-500">Klik atau seret file PDF ke sini</p>
          <p className="text-xs text-gray-400">Hanya format .pdf</p>
        </>
      )}
    </div>
  );
}
