import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function Table({ plans, onEdit, onDelete }) {
  if (!plans || plans.length === 0) {
    return (
      <div className="bg-[#EFE9E3] rounded-lg shadow-sm border border-[#D9CFC7] p-8 text-center text-gray-500">
        Belum ada paket langganan. Tambahkan paket baru untuk memulai.
      </div>
    );
  }

  return (
    <div className="bg-[#EFE9E3] rounded-lg shadow-sm border border-[#D9CFC7] overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#D9CFC7] bg-[#D9CFC7]/20">
            <th className="p-4 font-semibold text-gray-700">ID</th>
            <th className="p-4 font-semibold text-gray-700">Nama Paket</th>
            <th className="p-4 font-semibold text-gray-700">Harga</th>
            <th className="p-4 font-semibold text-gray-700">Durasi (Hari)</th>
            <th className="p-4 font-semibold text-gray-700">Iklan</th>
            <th className="p-4 font-semibold text-gray-700 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.planId} className="border-b border-[#D9CFC7] last:border-b-0 hover:bg-[#F9F8F6]/40 transition-colors">
              <td className="p-4 text-gray-600">{plan.planId}</td>
              <td className="p-4 font-medium text-gray-800">{plan.planName}</td>
              <td className="p-4 text-gray-600">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(plan.price)}
              </td>
              <td className="p-4 text-gray-600">{plan.durationDays}</td>
              <td className="p-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  plan.hasAds ? 'bg-[#F9F8F6] text-gray-600' : 'bg-[#D9CFC7] text-gray-600'
                }`}>
                  {plan.hasAds ? 'Ada' : 'Tidak Ada'}
                </span>
              </td>
              <td className="p-4 text-right space-x-2 whitespace-nowrap">
                <button 
                  onClick={() => onEdit(plan)}
                  className="p-1.5 text-black hover:text-black bg-yellow-400 hover:bg-yellow-500 border border-[#D9CFC7] rounded transition-colors inline-flex items-center justify-center"
                  title="Edit Paket"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => onDelete(plan)}
                  className="p-1.5 text-white hover:text-red-500 bg-red-600 hover:bg-red-700 border border-[#D9CFC7] rounded transition-colors inline-flex items-center justify-center"
                  title="Hapus Paket"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}