/**
 * @file components/ui/LoadingSpinner.jsx
 * @description Komponen spinner loading yang reusable.
 * Digunakan di berbagai halaman saat data sedang di-fetch.
 *
 * @example
 * <LoadingSpinner />
 * <LoadingSpinner size="sm" color="#C9B59C" />
 * <LoadingSpinner fullPage />
 */

/**
 * Spinner loading animasi.
 *
 * @param {Object} props
 * @param {"sm"|"md"|"lg"} [props.size="md"] - Ukuran spinner
 * @param {string} [props.color="#C9B59C"] - Warna border spinner
 * @param {boolean} [props.fullPage=false] - Tampilkan di tengah layar penuh jika true
 */
export default function LoadingSpinner({
  size = "md",
  color = "#C9B59C",
  fullPage = false,
}) {
  const sizeMap = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full ${sizeMap[size]}`}
      style={{ borderColor: `${color}33`, borderBottomColor: color }}
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F9F7F4]">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-sm text-stone-400 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-20">
      {spinner}
    </div>
  );
}
