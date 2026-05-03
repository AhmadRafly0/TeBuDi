import React from 'react';

const colors = {
  white: "#FFFFFF",
  lightBeige: "#F5F1ED",
  beige: "#E2D9D0",
  darkBeige: "#C9B9A9",
  brown: "#B49E88",
  textDark: "#4A3F35"
};

const CheckIcon = ({ color }) => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
  </svg>
);

const XIcon = ({ color }) => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

/**
 * Komponen Reusable SubscriptionCard
 * Pastikan file SubscriptionPage.jsx melakukan import:
 * import SubscriptionCard from '../components/SubscriptionCard';
 */
const SubscriptionCard = ({ plan, onSelect }) => {
  // Safety check agar tidak error jika data plan belum masuk
  if (!plan) return null;

  return (
    <div 
      className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
      style={{ backgroundColor: colors.white, border: `1px solid ${colors.beige}` }}
    >
      {/* Label Best Value jika tidak ada iklan/premium (hasAds = false) */}
      {!plan.hasAds && (
        <div className="absolute top-0 right-0 p-2">
          <span className="bg-yellow-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
            Best Value
          </span>
        </div>
      )}

      {/* Header Kartu */}
      <div className="p-8 text-center border-b border-gray-100">
        <h2 className="text-xl font-bold mb-1 uppercase tracking-widest" style={{ color: colors.brown }}>
          {plan.planName}
        </h2>
        <div className="flex items-baseline justify-center mt-4">
          <span className="text-4xl font-black" style={{ color: colors.textDark }}>
            {plan.formattedPrice || `Rp ${plan.price?.toLocaleString('id-ID')}`}
          </span>
          <span className="ml-1 text-gray-400 text-sm">/{plan.durationDays} hari</span>
        </div>
      </div>

      {/* Fitur-fitur List */}
      <div className="p-8 flex-grow">
        <ul className="space-y-4">
          <li className="flex items-center">
            <CheckIcon color={colors.brown} />
            <span className="ml-3 text-sm text-gray-700">Akses koleksi buku lengkap</span>
          </li>
          <li className="flex items-center">
            <CheckIcon color={colors.brown} />
            <span className="ml-3 text-sm text-gray-700">Durasi {plan.durationDays} hari aktif</span>
          </li>
          <li className="flex items-center">
            {plan.hasAds ? (
              <XIcon color="#e53e3e" />
            ) : (
              <CheckIcon color={colors.brown} />
            )}
            <span className={`ml-3 text-sm ${plan.hasAds ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
              Bebas Iklan (Premium)
            </span>
          </li>
          <li className="flex items-center">
            <CheckIcon color={colors.brown} />
            <span className="ml-3 text-sm text-gray-700">Bisa baca di Desktop/Web</span>
          </li>
        </ul>
      </div>

      {/* Tombol Aksi */}
      <div className="p-8 pt-0">
        <button 
          className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 hover:opacity-90"
          style={{ backgroundColor: colors.brown }}
          onClick={() => onSelect(plan)}
        >
          Pilih Paket Sekarang
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;