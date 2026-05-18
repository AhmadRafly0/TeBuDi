/**
 * @file components/subscription/PlanFormModal.jsx
 * @description Modal form untuk tambah dan edit paket langganan (admin).
 *
 * @example
 * // Tambah paket baru
 * <PlanFormModal onClose={() => setModal(null)} onSubmit={handleSave} loading={actionLoading} />
 *
 * // Edit paket
 * <PlanFormModal initial={plan} onClose={() => setModal(null)} onSubmit={handleSave} loading={actionLoading} />
 */

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import Field, { inputCls } from "../ui/Field";
import Toggle from "../ui/Toggle";

/**
 * Modal form tambah/edit paket langganan.
 *
 * @param {Object} props
 * @param {Object|null} [props.initial=null] - Data paket awal (null = mode tambah)
 * @param {function} props.onClose - Callback saat modal ditutup
 * @param {function} props.onSubmit - Callback saat form disubmit, menerima data paket yang sudah divalidasi
 * @param {boolean} [props.loading=false] - State loading dari parent saat proses simpan
 */
export default function PlanFormModal({ initial = null, onClose, onSubmit, loading = false }) {
  const isEdit = !!initial;

  const [form, setForm] = useState(
    initial
      ? {
          planName: initial.planName,
          price: initial.price,
          durationDays: initial.durationDays,
          hasAds: initial.hasAds,
        }
      : { planName: "", price: "", durationDays: "", hasAds: false }
  );
  const [error, setError] = useState(null);

  /** Helper untuk update satu field form */
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  /**
   * Validasi form sebelum memanggil onSubmit.
   * Konversi tipe data string ke number sebelum dikirim.
   */
  const handleSubmit = () => {
    if (!form.planName.trim()) return setError("Nama paket wajib diisi.");
    if (form.price === "" || form.price === null) return setError("Harga wajib diisi.");
    if (Number(form.price) < 0) return setError("Harga tidak boleh negatif.");
    if (!form.durationDays) return setError("Durasi wajib diisi.");
    if (Number(form.durationDays) < 1) return setError("Durasi minimal 1 hari.");

    setError(null);
    onSubmit({
      ...form,
      price: parseFloat(form.price),
      durationDays: parseInt(form.durationDays, 10),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#F9F8F6] rounded-lg shadow-xl w-full max-w-md border border-[#D9CFC7] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#D9CFC7] bg-[#EFE9E3]">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isEdit ? "Edit Paket" : "Tambah Paket Baru"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEdit
                ? `Mengubah: ${initial.planName}`
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
          {/* Nama paket */}
          <Field label="Nama Paket" required>
            <input
              className={inputCls}
              placeholder="Cth: Premium 1 Bulan"
              value={form.planName}
              disabled={loading}
              onChange={(e) => set("planName", e.target.value)}
            />
          </Field>

          {/* Harga dan durasi */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga (IDR)" required>
              <input
                className={inputCls}
                type="number"
                placeholder="Cth: 29000"
                min={0}
                value={form.price}
                disabled={loading}
                onChange={(e) => set("price", e.target.value)}
              />
            </Field>
            <Field label="Durasi (Hari)" required>
              <input
                className={inputCls}
                type="number"
                placeholder="Cth: 30"
                min={1}
                value={form.durationDays}
                disabled={loading}
                onChange={(e) => set("durationDays", e.target.value)}
              />
            </Field>
          </div>

          {/* Toggle iklan */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-700">Sertakan Iklan</p>
              <p className="text-xs text-gray-500">
                Paket ini akan menampilkan iklan kepada pengguna
              </p>
            </div>
            <Toggle
              checked={form.hasAds}
              onChange={(v) => set("hasAds", v)}
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

        {/* Footer */}
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
            {loading ? "Proses..." : isEdit ? "Simpan Perubahan" : "Tambah Paket"}
          </button>
        </div>
      </div>
    </div>
  );
}
