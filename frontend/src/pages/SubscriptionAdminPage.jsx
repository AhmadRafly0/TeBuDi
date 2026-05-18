/**
 * @file pages/SubscriptionAdminPage.jsx
 * @description Halaman manajemen paket langganan untuk admin.
 *
 * Fitur:
 * - Tampilkan semua paket dalam grid
 * - Filter berdasarkan tab (semua/tanpa iklan/dengan iklan)
 * - Pencarian berdasarkan nama paket
 * - Tambah, edit, dan hapus paket
 * - Statistik ringkasan
 *
 * Hanya bisa diakses oleh user dengan role "admin" (dijaga oleh AdminRoute).
 */

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, RefreshCw, Search } from "lucide-react";

// Komponen modular
import { PlanCard, PlanFormModal } from "../components/subscription";
import { StatCard, DeleteConfirmModal } from "../components/ui";
import { fetchPlans, createPlan, updatePlan, deletePlan } from "../services/subscriptionService";

/**
 * Halaman manajemen paket langganan (admin).
 */
export default function SubscriptionAdminPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // State filter dan pencarian
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState("all");

  // State modal
  const [modal, setModal] = useState(null); // { mode: "add" | "edit", plan?: Object }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Fetch semua paket dari API.
   */
  const loadPlans = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchPlans();
      setPlans(data);
    } catch {
      setFetchError("Gagal memuat data paket. Periksa koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat komponen pertama kali dimuat
  useEffect(() => {
    loadPlans();
  }, []);

  /**
   * Simpan paket baru atau update paket yang sudah ada.
   * @param {Object} planData - Data paket yang sudah divalidasi dari PlanFormModal
   */
  const handleSave = async (planData) => {
    setActionLoading(true);
    try {
      if (modal?.mode === "edit") {
        await updatePlan(modal.plan.planId, planData);
        toast.success("Paket berhasil diubah!! :D");
      } else {
        await createPlan(planData);
        toast.success("Paket berhasil ditambahkan!! :D");
      }
      setModal(null);
      loadPlans();
    } catch {
      toast.error(
        modal?.mode === "edit"
          ? "Gagal mengubah paket.. :("
          : "Gagal membuat paket.. :("
      );
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Hapus paket yang dipilih dari server.
   */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await deletePlan(deleteTarget.planId);
      toast.success("Paket berhasil dihapus!! :D");
      setDeleteTarget(null);
      loadPlans();
    } catch {
      toast.error("Gagal menghapus paket.. :(");
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Filter paket berdasarkan tab dan query pencarian.
   */
  const filtered = plans.filter((p) => {
    if (tabFilter === "ads" && !p.hasAds) return false;
    if (tabFilter === "no-ads" && p.hasAds) return false;
    const q = search.toLowerCase();
    if (q && !p.planName?.toLowerCase().includes(q)) return false;
    return true;
  });

  // Hitung statistik
  const totalAds = plans.filter((p) => p.hasAds).length;
  const totalNoAds = plans.length - totalAds;

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans">
      <div className="max-w-6xl mx-auto p-6 md:p-10">

        {/* Header halaman */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Paket Langganan</h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola pilihan paket membaca untuk platform TeBuDi.
            </p>
          </div>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="bg-[#C9B59C] hover:bg-[#b09b82] text-white px-5 py-2.5 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            <span>Tambah Paket Baru</span>
          </button>
        </div>

        {/* Kartu statistik */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Total Paket" value={plans.length} />
          <StatCard label="Tanpa Iklan" value={totalNoAds} accent />
          <StatCard label="Dengan Iklan" value={totalAds} />
        </div>

        {/* Tab filter */}
        <div className="flex gap-1 mb-4 border-b border-[#D9CFC7]">
          {[
            { key: "all", label: "Semua" },
            { key: "no-ads", label: "Tanpa Iklan" },
            { key: "ads", label: "Dengan Iklan" },
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

        {/* Search dan refresh */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari nama paket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#D9CFC7] rounded bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition"
            />
          </div>
          <button
            onClick={loadPlans}
            title="Refresh"
            className="px-3 py-2 border border-[#D9CFC7] rounded bg-white text-gray-500 hover:bg-[#EFE9E3] hover:text-gray-800 transition"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Konten: loading / error / kosong / grid paket */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9B59C]" />
          </div>
        ) : fetchError ? (
          <div className="bg-[#EFE9E3] rounded-lg border border-[#D9CFC7] p-8 text-center">
            <p className="text-sm text-red-500 mb-3">{fetchError}</p>
            <button
              onClick={loadPlans}
              className="text-sm px-4 py-2 border border-[#D9CFC7] rounded hover:bg-[#F9F8F6] transition"
            >
              Coba lagi
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#EFE9E3] rounded-lg border border-[#D9CFC7] p-8 text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-[#D9CFC7]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <p className="text-sm">
              {search
                ? "Tidak ada paket yang cocok."
                : "Belum ada paket. Tambahkan paket pertama!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((plan) => (
              <PlanCard
                key={plan.planId}
                plan={plan}
                onEdit={(p) => setModal({ mode: "edit", plan: p })}
                onDelete={(p) => setDeleteTarget(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal tambah/edit paket */}
      {modal && (
        <PlanFormModal
          initial={modal.mode === "edit" ? modal.plan : null}
          onClose={() => setModal(null)}
          onSubmit={handleSave}
          loading={actionLoading}
        />
      )}

      {/* Modal konfirmasi hapus */}
      {deleteTarget && (
        <DeleteConfirmModal
          title="Hapus Paket"
          itemName={deleteTarget.planName}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
