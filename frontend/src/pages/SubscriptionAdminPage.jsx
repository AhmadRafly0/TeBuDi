import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, X, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
        checked ? "bg-[#C9B59C]" : "bg-[#D9CFC7]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm border border-[#D9CFC7] rounded bg-white text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition disabled:bg-gray-100";

// ─── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({ plan, onEdit, onDelete }) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(plan.price);

  return (
    <div className="group relative flex flex-col bg-[#F9F8F6] border border-[#D9CFC7] rounded-lg overflow-hidden hover:border-[#C9B59C] hover:shadow-md transition-all duration-200">
      {/* Top accent area */}
      <div className="relative h-28 flex flex-col items-center justify-center bg-[#EFE9E3] gap-1 px-3">
        {/* Icon */}
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

        {/* Has ads badge */}
        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            plan.hasAds
              ? "bg-[#D9CFC7] text-gray-700"
              : "bg-[#C9B59C] text-white"
          }`}
        >
          {plan.hasAds ? "Dengan Iklan" : "Tanpa Iklan"}
        </span>

        {/* Plan ID badge */}
        <span className="absolute top-2 left-2 text-[10px] text-gray-400 font-mono bg-white/70 px-1.5 py-0.5 rounded">
          #{plan.planId}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
          {plan.planName}
        </h3>
        <p className="text-base font-bold text-[#C9B59C]">{formattedPrice}</p>
        <p className="text-xs text-gray-500">{plan.durationDays} hari</p>
      </div>

      {/* Actions */}
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

// ─── Plan Form Modal ──────────────────────────────────────────────────────────
function PlanModal({ initial, onClose, onSubmit, loading }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    initial
      ? { planName: initial.planName, price: initial.price, durationDays: initial.durationDays, hasAds: initial.hasAds }
      : { planName: '', price: '', durationDays: '', hasAds: false }
  );
  const [error, setError] = useState(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.planName.trim()) return setError("Nama paket wajib diisi.");
    if (form.price === '' || form.price === null) return setError("Harga wajib diisi.");
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
              {isEdit ? `Mengubah: ${initial.planName}` : "Isi semua kolom wajib untuk menyimpan"}
            </p>
          </div>
          <button onClick={onClose} disabled={loading} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-4">
          <Field label="Nama Paket" required>
            <input
              className={inputCls}
              placeholder="Cth: Premium 1 Bulan"
              value={form.planName}
              disabled={loading}
              onChange={(e) => set('planName', e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga (IDR)" required>
              <input
                className={inputCls}
                type="number"
                placeholder="Cth: 29000"
                min={0}
                value={form.price}
                disabled={loading}
                onChange={(e) => set('price', e.target.value)}
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
                onChange={(e) => set('durationDays', e.target.value)}
              />
            </Field>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-700">Sertakan Iklan</p>
              <p className="text-xs text-gray-500">Paket ini akan menampilkan iklan kepada pengguna</p>
            </div>
            <Toggle checked={form.hasAds} onChange={(v) => set('hasAds', v)} disabled={loading} />
          </div>

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

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirm({ planName, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F9F8F6] rounded-lg shadow-xl w-full max-w-sm border border-[#D9CFC7] overflow-hidden text-center">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Hapus Paket</h2>
          <p className="text-gray-600 text-sm">
            Apakah kamu yakin ingin menghapus <span className="font-medium text-gray-800">"{planName}"</span>? Data yang dihapus tidak bisa dikembalikan.
          </p>
        </div>
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
            {loading ? "Proses..." : "Hapus Paket"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, accent }) {
  return (
    <div className={`flex flex-col gap-1 rounded-lg px-4 py-3 bg-[#EFE9E3] border ${accent ? "border-[#C9B59C]" : "border-[#D9CFC7]"}`}>
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-2xl font-bold text-gray-800">{value}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SubscriptionAdminPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [search, setSearch] = useState('');
  const [tabFilter, setTabFilter] = useState('all'); // all | ads | no-ads

  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', plan }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const response = await axios.get('/api/plans');
      setPlans(response.data.data ?? []);
    } catch {
      setFetchError("Gagal memuat data paket. Periksa koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSave = async (planData) => {
    setActionLoading(true);
    try {
      if (modal?.mode === 'edit') {
        await axios.put(`/api/plans/${modal.plan.planId}`, planData);
        toast.success('Paket berhasil diubah!! :D');
      } else {
        await axios.post('/api/plans', planData);
        toast.success('Paket berhasil ditambahkan!! :D');
      }
      setModal(null);
      fetchPlans();
    } catch {
      toast.error(modal?.mode === 'edit' ? 'Gagal mengubah paket.. :(' : 'Gagal membuat paket.. :(');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/plans/${deleteTarget.planId}`);
      toast.success('Paket berhasil dihapus!! :D');
      setDeleteTarget(null);
      fetchPlans();
    } catch {
      toast.error('Gagal menghapus paket.. :(');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = plans.filter((p) => {
    if (tabFilter === 'ads' && !p.hasAds) return false;
    if (tabFilter === 'no-ads' && p.hasAds) return false;
    const q = search.toLowerCase();
    if (q && !p.planName?.toLowerCase().includes(q)) return false;
    return true;
  });

  const totalAds = plans.filter((p) => p.hasAds).length;
  const totalNoAds = plans.length - totalAds;

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans">
      <div className="max-w-6xl mx-auto p-6 md:p-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Paket Langganan</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola pilihan paket membaca untuk platform TeBuDi.</p>
          </div>
          <button
            onClick={() => setModal({ mode: 'add' })}
            className="bg-[#C9B59C] hover:bg-[#b09b82] text-white px-5 py-2.5 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            <span>Tambah Paket Baru</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Total Paket" value={plans.length} />
          <StatCard label="Tanpa Iklan" value={totalNoAds} accent />
          <StatCard label="Dengan Iklan" value={totalAds} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-[#D9CFC7]">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'no-ads', label: 'Tanpa Iklan' },
            { key: 'ads', label: 'Dengan Iklan' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTabFilter(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tabFilter === t.key
                  ? "border-[#C9B59C] text-gray-800"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search & Refresh */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama paket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#D9CFC7] rounded bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition"
            />
          </div>
          <button
            onClick={fetchPlans}
            title="Refresh"
            className="px-3 py-2 border border-[#D9CFC7] rounded bg-white text-gray-500 hover:bg-[#EFE9E3] hover:text-gray-800 transition"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9B59C]"></div>
          </div>
        ) : fetchError ? (
          <div className="bg-[#EFE9E3] rounded-lg border border-[#D9CFC7] p-8 text-center">
            <p className="text-sm text-red-500 mb-3">{fetchError}</p>
            <button
              onClick={fetchPlans}
              className="text-sm px-4 py-2 border border-[#D9CFC7] rounded hover:bg-[#F9F8F6] transition"
            >
              Coba lagi
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#EFE9E3] rounded-lg border border-[#D9CFC7] p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-[#D9CFC7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <p className="text-sm">
              {search ? "Tidak ada paket yang cocok." : "Belum ada paket. Tambahkan paket pertama!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((plan) => (
              <PlanCard
                key={plan.planId}
                plan={plan}
                onEdit={(p) => setModal({ mode: 'edit', plan: p })}
                onDelete={(p) => setDeleteTarget(p)}
              />
            ))}
          </div>
        )}
      </div>

      {modal && (
        <PlanModal
          initial={modal.mode === 'edit' ? modal.plan : null}
          onClose={() => setModal(null)}
          onSubmit={handleSave}
          loading={actionLoading}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          planName={deleteTarget.planName}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}