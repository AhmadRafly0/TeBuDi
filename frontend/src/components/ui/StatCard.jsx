/**
 * @file components/ui/StatCard.jsx
 * @description Kartu statistik kecil yang reusable.
 * Digunakan di halaman admin (BookManagementPage, SubscriptionAdminPage)
 * untuk menampilkan angka ringkasan seperti total buku, total premium, dll.
 *
 * @example
 * <StatCard label="Total Buku" value={42} />
 * <StatCard label="Premium" value={10} accent />
 */

/**
 * Kartu statistik dengan label dan nilai.
 *
 * @param {Object} props
 * @param {string} props.label - Label deskripsi statistik
 * @param {number|string} props.value - Nilai yang ditampilkan
 * @param {boolean} [props.accent=false] - Gunakan border aksen coklat jika true
 */
export default function StatCard({ label, value, accent = false }) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-lg px-4 py-3 bg-[#EFE9E3] border ${
        accent ? "border-[#C9B59C]" : "border-[#D9CFC7]"
      }`}
    >
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-2xl font-bold text-gray-800">{value}</span>
    </div>
  );
}
