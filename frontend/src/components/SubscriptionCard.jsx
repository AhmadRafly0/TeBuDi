/**
 * @file components/SubscriptionCard.jsx
 * @description Kartu paket langganan yang ditampilkan di halaman SubscriptionPage (user).
 *
 * Menampilkan nama paket, harga, durasi, fitur-fitur, dan tombol pilih paket.
 * Berbeda dengan PlanCard (admin) — ini untuk tampilan user-facing.
 *
 * @example
 * <SubscriptionCard
 *   plan={plan}
 *   onSelect={handleSelectPlan}
 *   loadingPlanId={loadingPlanId}
 * />
 */

/** Ikon centang untuk fitur yang tersedia */
const CheckIcon = () => (
  <svg
    className="w-5 h-5 flex-shrink-0"
    fill="none"
    stroke="#B49E88"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

/** Ikon silang untuk fitur yang tidak tersedia */
const XIcon = () => (
  <svg
    className="w-5 h-5 flex-shrink-0"
    fill="none"
    stroke="#e53e3e"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

/**
 * Format harga ke format Rupiah Indonesia.
 * @param {number} price
 * @returns {string} Contoh: "Rp 29.000"
 */
const formatPrice = (price) => `Rp ${price.toLocaleString("id-ID")}`;

/**
 * Kartu paket langganan untuk halaman user.
 *
 * @param {Object} props
 * @param {Object} props.plan - Data paket langganan
 * @param {function} props.onSelect - Callback saat tombol pilih diklik, menerima object plan
 * @param {number|null} [props.loadingPlanId] - ID paket yang sedang diproses (untuk loading state)
 */
export default function SubscriptionCard({ plan, onSelect, loadingPlanId }) {
  // Cek apakah paket ini sedang dalam proses checkout
  const isLoading = loadingPlanId === plan.planId;

  if (!plan) return null;

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full bg-white"
      style={{ border: "1px solid #E2D9D0" }}
    >
      {/* Badge "Best Value" untuk paket tanpa iklan */}
      {!plan.hasAds && (
        <div className="absolute top-0 right-0 p-2">
          <span className="bg-yellow-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter text-black">
            Best Value
          </span>
        </div>
      )}

      {/* Header: nama dan harga */}
      <div className="p-8 text-center border-b border-gray-100">
        <h2
          className="text-xl font-bold mb-1 uppercase tracking-widest"
          style={{ color: "#B49E88" }}
        >
          {plan.planName}
        </h2>
        <div className="flex items-baseline justify-center mt-4">
          <span className="text-4xl font-black" style={{ color: "#4A3F35" }}>
            {formatPrice(plan.price)}
          </span>
          <span className="ml-1 text-gray-400 text-sm">/{plan.durationDays} hari</span>
        </div>
      </div>

      {/* Daftar fitur */}
      <div className="p-8 flex-grow">
        <ul className="space-y-4 text-sm text-gray-700">
          <li className="flex items-center">
            <CheckIcon />
            <span className="ml-3">Akses koleksi buku lengkap</span>
          </li>
          <li className="flex items-center">
            <CheckIcon />
            <span className="ml-3">Durasi {plan.durationDays} hari aktif</span>
          </li>
          <li className="flex items-center">
            {/* Fitur bebas iklan: centang jika tidak ada iklan, silang jika ada */}
            {plan.hasAds ? <XIcon /> : <CheckIcon />}
            <span className={`ml-3 ${plan.hasAds ? "text-gray-400 line-through" : "font-medium"}`}>
              Fitur Bebas Iklan
            </span>
          </li>
        </ul>
      </div>

      {/* Tombol pilih paket */}
      <div className="p-8 pt-0">
        <button
          className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: "#B49E88" }}
          onClick={() => onSelect(plan)}
          disabled={!!loadingPlanId}
        >
          {isLoading ? (
            <>
              {/* Spinner loading */}
              <svg
                className="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Memproses...
            </>
          ) : (
            "Pilih Paket"
          )}
        </button>
      </div>
    </div>
  );
}
