/**
 * @file components/subscription/PlanCard.jsx
 * @description Kartu paket langganan untuk tampilan grid di halaman admin SubscriptionAdminPage.
 * Menampilkan info paket dan tombol edit/hapus.
 *
 * @example
 * <PlanCard
 *   plan={plan}
 *   onEdit={(p) => setModal({ mode: "edit", plan: p })}
 *   onDelete={(p) => setDeleteTarget(p)}
 * />
 */

import { Pencil, Trash2 } from "lucide-react";

/**
 * Kartu paket langganan untuk halaman admin.
 *
 * @param {Object} props
 * @param {Object} props.plan - Data paket langganan
 * @param {function} props.onEdit - Callback saat tombol edit diklik, menerima object plan
 * @param {function} props.onDelete - Callback saat tombol hapus diklik, menerima object plan
 */
export default function PlanCard({ plan, onEdit, onDelete }) {
  // Format harga ke format Rupiah Indonesia
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(plan.price);

  return (
    <div className="group relative flex flex-col bg-[#F9F8F6] border border-[#D9CFC7] rounded-lg overflow-hidden hover:border-[#C9B59C] hover:shadow-md transition-all duration-200">
      {/* Header kartu dengan ikon dan badge */}
      <div className="relative h-28 flex flex-col items-center justify-center bg-[#EFE9E3] gap-1 px-3">
        {/* Ikon paket */}
        <svg
          className="w-8 h-8 text-[#C9B59C]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M9 21V9" />
        </svg>

        {/* Badge iklan/tanpa iklan */}
        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            plan.hasAds
              ? "bg-[#D9CFC7] text-gray-700"
              : "bg-[#C9B59C] text-white"
          }`}
        >
          {plan.hasAds ? "Dengan Iklan" : "Tanpa Iklan"}
        </span>

        {/* ID paket */}
        <span className="absolute top-2 left-2 text-[10px] text-gray-400 font-mono bg-white/70 px-1.5 py-0.5 rounded">
          #{plan.planId}
        </span>
      </div>

      {/* Info paket */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
          {plan.planName}
        </h3>
        <p className="text-base font-bold text-[#C9B59C]">{formattedPrice}</p>
        <p className="text-xs text-gray-500">{plan.durationDays} hari</p>
      </div>

      {/* Tombol aksi */}
      <div className="flex border-t border-[#D9CFC7]">
        <button
          onClick={() => onEdit(plan)}
          className="flex-1 py-2 text-xs text-gray-600 hover:bg-[#EFE9E3] hover:text-gray-900 transition-colors flex items-center justify-center gap-1"
        >
          <Pencil size={12} /> Edit
        </button>
        <div className="w-px bg-[#D9CFC7]" />
        <button
          onClick={() => onDelete(plan)}
          className="flex-1 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
        >
          <Trash2 size={12} /> Hapus
        </button>
      </div>
    </div>
  );
}
