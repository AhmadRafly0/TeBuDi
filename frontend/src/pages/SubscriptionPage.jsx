/**
 * @file pages/SubscriptionPage.jsx
 * @description Halaman pilih paket langganan — responsif untuk mobile, tablet, desktop.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import SubscriptionCard from "../components/SubscriptionCard";
import { fetchPlans, checkoutPlan } from "../services/subscriptionService";

export default function SubscriptionPage() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchPlans();
        setPlans(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  const handleSelectPlan = async (plan) => {
    setLoadingPlanId(plan.planId);
    setCheckoutError(null);
    try {
      const transaction = await checkoutPlan(plan.planId);
      navigate("/payment", { state: { transaction } });
    } catch (err) {
      setCheckoutError(err.response?.data?.message || err.message);
    } finally {
      setLoadingPlanId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#B49E88]" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <p className="text-lg font-semibold text-red-500">Gagal memuat data</p>
          <p className="text-sm text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-5 py-2 rounded-xl border border-[#D9CFC7] text-sm text-[#B49E88] hover:bg-[#EFE9E3] transition"
          >
            Coba lagi
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Tombol kembali */}
        <button
          onClick={() => navigate("/home")}
          className="group flex items-center gap-2 mb-8 text-sm font-semibold text-[#4A3F35] hover:text-[#A3846B] transition-colors"
        >
          <div className="p-1.5 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all border border-[#E2D9D0]">
            <ArrowLeft size={16} className="text-[#B49E88]" />
          </div>
          Kembali ke Beranda
        </button>

        {/* Hero header */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden mb-8 md:mb-12 bg-gradient-to-br from-[#A3846B] to-[#C9B59C] p-6 md:p-10 text-white text-center">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <Sparkles size={14} className="text-yellow-200" />
              <span className="text-xs font-bold tracking-wide text-white">Premium Access</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold mb-2 md:mb-3">
              Subscription Plan
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-md mx-auto">
              Pilih paket terbaik untuk menikmati literasi tanpa batas
            </p>
          </div>
        </div>

        {/* Error checkout */}
        {checkoutError && (
          <div className="mb-6 p-4 rounded-2xl text-center text-sm font-medium bg-red-50 border border-red-200 text-red-600">
            {checkoutError}
          </div>
        )}

        {/* Grid kartu paket */}
        {plans.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#D9CFC7]">
            <p className="text-gray-400">Belum ada paket tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {plans.map((plan) => (
              <SubscriptionCard
                key={plan.planId}
                plan={plan}
                onSelect={handleSelectPlan}
                loadingPlanId={loadingPlanId}
              />
            ))}
          </div>
        )}

        {/* Catatan kecil di bawah */}
        <p className="text-center text-xs text-stone-400 mt-8">
          Semua paket dapat dibatalkan kapan saja. Pembayaran bersifat sekali bayar.
        </p>
      </div>
    </DashboardLayout>
  );
}
