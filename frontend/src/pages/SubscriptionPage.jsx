/**
 * @file pages/SubscriptionPage.jsx
 * @description Halaman pilih paket langganan untuk user.
 *
 * Menampilkan semua paket yang tersedia dalam grid kartu.
 * Saat user memilih paket, akan melakukan checkout dan redirect ke PaymentPage.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Komponen dan service modular
import SubscriptionCard from "../components/SubscriptionCard";
import { fetchPlans, checkoutPlan } from "../services/subscriptionService";

/**
 * Halaman pilih paket langganan.
 * Fetch daftar paket dari API saat mount.
 */
export default function SubscriptionPage() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** ID paket yang sedang diproses checkout (untuk loading state per kartu) */
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  /** Pesan error saat checkout gagal */
  const [checkoutError, setCheckoutError] = useState(null);

  // Fetch daftar paket saat komponen mount
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

  /**
   * Handle pemilihan paket: checkout lalu redirect ke PaymentPage.
   * @param {Object} plan - Paket yang dipilih user
   */
  const handleSelectPlan = async (plan) => {
    setLoadingPlanId(plan.planId);
    setCheckoutError(null);

    try {
      const transaction = await checkoutPlan(plan.planId);
      // Kirim data transaksi ke PaymentPage via router state
      navigate("/payment", { state: { transaction } });
    } catch (err) {
      setCheckoutError(err.response?.data?.message || err.message);
    } finally {
      setLoadingPlanId(null);
    }
  };

  // State: loading
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F5F1ED" }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-4"
          style={{ borderColor: "#B49E88" }}
        />
      </div>
    );
  }

  // State: error fetch
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F5F1ED" }}
      >
        <div className="text-center">
          <p className="text-lg font-semibold mb-2" style={{ color: "#e53e3e" }}>
            Gagal memuat data
          </p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{ backgroundColor: "#F5F1ED" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Tombol kembali ke beranda */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/home")}
            className="group flex items-center gap-2 font-bold transition-all hover:translate-x-[-4px]"
            style={{ color: "#4A3F35" }}
          >
            <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={20} strokeWidth={3} style={{ color: "#B49E88" }} />
            </div>
            <span className="text-sm uppercase tracking-widest">
              Kembali ke Beranda
            </span>
          </button>
        </div>

        {/* Header halaman */}
        <header className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: "#4A3F35" }}
          >
            Subscription Plan
          </h1>
          <p className="text-gray-500">
            Pilih paket terbaik untuk menikmati literasi tanpa batas
          </p>
        </header>

        {/* Pesan error checkout */}
        {checkoutError && (
          <div
            className="mb-8 p-4 rounded-2xl text-center text-sm font-medium bg-red-50 border border-red-200"
            style={{ color: "#e53e3e" }}
          >
            {checkoutError}
          </div>
        )}

        {/* Grid kartu paket */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <SubscriptionCard
              key={plan.planId}
              plan={plan}
              onSelect={handleSelectPlan}
              loadingPlanId={loadingPlanId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
