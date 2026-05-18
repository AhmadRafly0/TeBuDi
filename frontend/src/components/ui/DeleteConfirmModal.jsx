/**
 * @file components/ui/DeleteConfirmModal.jsx
 * @description Modal konfirmasi hapus yang reusable.
 * Digunakan di BookManagementPage dan SubscriptionAdminPage.
 *
 * @example
 * <DeleteConfirmModal
 *   title="Hapus Buku"
 *   itemName={book.title}
 *   onConfirm={handleDelete}
 *   onCancel={() => setDeleteTarget(null)}
 *   loading={deleting}
 * />
 */

import { AlertCircle } from "lucide-react";

/**
 * Modal konfirmasi sebelum menghapus data.
 *
 * @param {Object} props
 * @param {string} props.title - Judul modal (misal: "Hapus Buku")
 * @param {string} props.itemName - Nama item yang akan dihapus (ditampilkan dalam tanda kutip)
 * @param {function} props.onConfirm - Callback saat tombol hapus diklik
 * @param {function} props.onCancel - Callback saat tombol batal diklik
 * @param {boolean} [props.loading=false] - Tampilkan state loading saat proses hapus
 */
export default function DeleteConfirmModal({
  title,
  itemName,
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F9F8F6] rounded-lg shadow-xl w-full max-w-sm border border-[#D9CFC7] overflow-hidden text-center">
        {/* Ikon peringatan */}
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm">
            Apakah kamu yakin ingin menghapus{" "}
            <span className="font-medium text-gray-800">"{itemName}"</span>?{" "}
            Data yang dihapus tidak bisa dikembalikan.
          </p>
        </div>

        {/* Tombol aksi */}
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
            {loading ? "Proses..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
