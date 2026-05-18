/**
 * @file components/SubscriptionCard.jsx
 * @description Kartu paket langganan — responsif, user-facing.
 */

import { Check, X } from "lucide-react";

const formatPrice = (price) => `Rp ${Number(price).toLocaleString("id-ID")}`;

/**
 * @param {{ plan, onSelect, loadingPlanId }} props
 */
export default function SubscriptionCard({ plan, onSelect, loadingPlanId }) {
  const isLoading = loadingPlanId === plan.planId;
  const isBestValue = !plan.hasAds;

  if (!plan) return null;

  return (
    <div
      className={`relative flex flex-col rounded-2xl md:rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden ${
        isBestValue ? "ring-2 ring-[#B49E88]" : "border border-[#E2D9D0]"
      }`}
    >
      {/* Badge Best Value */}
      {isBestValue && (
        <div className="bg-[#B49E88] text-white text-[10px] font-bold text-center py-1.5 tracking-widest uppercase">
          ✦ Best Value
        </div>
      )}

      {/* Header: nama + harga */}
      <div className="px-6 pt-6 pb-5 text-center border-b border-[#F0EBE5]">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#B49E88] mb-3">
          {plan.planName}
        </h2>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl md:text-4xl font-black text-[#4A3F35]">
            {formatPrice(plan.price)}
          </span>
        </div>
        <p className="text-xs text-stone-400 mt-1">untuk {plan.durationDays} hari</p>
      </div>

      {/* Fitur */}
      <div className="px-6 py-5 flex-grow">
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-center gap-3">
            <Check size={16} className="text-[#B49E88] flex-shrink-0" strokeWidth={3} />
            <span>Akses koleksi buku lengkap</span>
          </li>
          <li className="flex items-center gap-3">
            <Check size={16} className="text-[#B49E88] flex-shrink-0" strokeWidth={3} />
            <span>Aktif selama {plan.durationDays} hari</span>
          </li>
          <li className="flex items-center gap-3">
            {plan.hasAds ? (
              <X size={16} className="text-red-400 flex-shrink-0" strokeWidth={3} />
            ) : (
              <Check size={16} className="text-[#B49E88] flex-shrink-0" strokeWidth={3} />
            )}
            <span className={plan.hasAds ? "text-stone-400 line-through" : "font-medium"}>
              Bebas Iklan
            </span>
          </li>
        </ul>
      </div>

      {/* Tombol */}
      <div className="px-6 pb-6">
        <button
          onClick={() => onSelect(plan)}
          disabled={!!loadingPlanId}
          className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            isBestValue
              ? "bg-[#A3846B] hover:bg-[#8a6d57]"
              : "bg-[#C9B59C] hover:bg-[#b09b82]"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
