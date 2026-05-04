import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const colors = {
  white: "#FFFFFF",
  lightBeige: "#F5F1ED",
  beige: "#E2D9D0",
  darkBeige: "#C9B9A9",
  brown: "#B49E88",
  textDark: "#4A3F35",
  danger: "#e53e3e"
};

const CheckIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke={colors.brown} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke={colors.danger} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const formatPrice = (price) => `Rp ${price.toLocaleString('id-ID')}`;

const SubscriptionCard = ({ plan, onSelect, loadingPlanId }) => {
  const isLoading = loadingPlanId === plan.planId;

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full bg-white"
      style={{ border: `1px solid ${colors.beige}` }}
    >

      
      {!plan.hasAds && (
        <div className="absolute top-0 right-0 p-2">
          <span className="bg-yellow-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter text-black">
            Best Value
          </span>
        </div>
      )}

      <div className="p-8 text-center border-b border-gray-100">
        <h2 className="text-xl font-bold mb-1 uppercase tracking-widest" style={{ color: colors.brown }}>
          {plan.planName}
        </h2>
        <div className="flex items-baseline justify-center mt-4">
          <span className="text-4xl font-black" style={{ color: colors.textDark }}>
            {formatPrice(plan.price)}
          </span>
          <span className="ml-1 text-gray-400 text-sm">/{plan.durationDays} hari</span>
        </div>
      </div>

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
            {plan.hasAds ? <XIcon /> : <CheckIcon />}
            <span className={`ml-3 ${plan.hasAds ? 'text-gray-400 line-through' : 'font-medium'}`}>
              Fitur Bebas Iklan
            </span>
          </li>
        </ul>
      </div>

      <div className="p-8 pt-0">
        <button
          className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: colors.brown }}
          onClick={() => onSelect(plan)}
          disabled={!!loadingPlanId}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Memproses...
            </>
          ) : 'Pilih Paket'}
        </button>
      </div>
    </div>
  );
};

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data: json } = await axios.get('/api/plans');
        if (!json.success) throw new Error(json.message || 'Gagal mengambil data plan.');
        setPlans(json.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (plan) => {
    setLoadingPlanId(plan.planId);
    setCheckoutError(null);

    try {
      const { data: json } = await axios.post('/api/subscriptions/checkout', {
        planId: plan.planId
      });

      if (!json.success) throw new Error(json.message || 'Checkout gagal.');

      navigate('/payment', { state: { transaction: json.data } });

    } catch (err) {
      setCheckoutError(err.response?.data?.message || err.message);
    } finally {
      setLoadingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.lightBeige }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4" style={{ borderColor: colors.brown }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.lightBeige }}>
        <div className="text-center">
          <p className="text-lg font-semibold mb-2" style={{ color: colors.danger }}>Gagal memuat data</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: colors.lightBeige }}>
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: colors.textDark }}>
            Subscription Plan
          </h1>
        </header>

        {checkoutError && (
          <div className="mb-8 p-4 rounded-2xl text-center text-sm font-medium bg-red-50 border border-red-200" style={{ color: colors.danger }}>
            {checkoutError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((item) => (
            <SubscriptionCard
              key={item.planId}
              plan={item}
              onSelect={handleSelectPlan}
              loadingPlanId={loadingPlanId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;