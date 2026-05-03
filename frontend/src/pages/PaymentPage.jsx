import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const colors = {
  lightBeige: "#F5F1ED",
  beige: "#E2D9D0",
  brown: "#B49E88",
  textDark: "#4A3F35",
  danger: "#e53e3e",
  success: "#38a169"
};

const formatPrice = (amount) => `Rp ${Number(amount).toLocaleString('id-ID')}`;
const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const transaction = state?.transaction;

  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!transaction) {
    navigate('/subscription');
    return null;
  }

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: json } = await axios.post('/api/subscriptions/payment-callback', {
        transactionId: transaction.transactionId
      });

      if (!json.success) throw new Error(json.message || 'Pembayaran gagal.');

      setSuccess(true);

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    setCancelLoading(true);
    setError(null);

    try {
      await axios.post('/api/subscriptions/cancel', {
        transactionId: transaction.transactionId
      });
      
      navigate('/subscription');

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal membatalkan pembayaran.');
      setCancelLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: colors.lightBeige }}>
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center" style={{ border: `1px solid ${colors.beige}` }}>
          <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-6" style={{ backgroundColor: '#f0fff4' }}>
            <svg className="w-8 h-8" fill="none" stroke={colors.success} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: colors.textDark }}>Pembayaran Berhasil!</h2>
          <p className="text-gray-500 text-sm mb-8">
            Langganan <span className="font-semibold" style={{ color: colors.brown }}>{transaction.planName}</span> kamu sekarang aktif.
          </p>
          <button
            className="w-full py-4 rounded-2xl font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor: colors.brown }}
            onClick={() => navigate('/home')}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const isProcessing = loading || cancelLoading;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: colors.lightBeige }}>
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full" style={{ border: `1px solid ${colors.beige}` }}>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold" style={{ color: colors.textDark }}>Konfirmasi Pembayaran</h1>
          <p className="text-sm text-gray-400 mt-1">Selesaikan pembayaran untuk mengaktifkan langganan</p>
        </div>

        <div className="rounded-2xl p-6 mb-6 space-y-3" style={{ backgroundColor: colors.lightBeige }}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: colors.brown }}>Ringkasan Pesanan</h3>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Paket</span>
            <span className="font-semibold" style={{ color: colors.textDark }}>{transaction.planName}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
              {transaction.status}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">ID Transaksi</span>
            <span className="font-mono text-xs text-gray-400 truncate max-w-[180px]">{transaction.transactionId}</span>
          </div>

          <div className="border-t pt-3 mt-3 flex justify-between" style={{ borderColor: colors.beige }}>
            <span className="font-bold" style={{ color: colors.textDark }}>Total</span>
            <span className="text-xl font-extrabold" style={{ color: colors.textDark }}>
              {formatPrice(transaction.amount)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center font-medium bg-red-50 border border-red-200" style={{ color: colors.danger }}>
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            className="w-full py-4 rounded-2xl font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: colors.brown }}
            onClick={handleConfirmPayment}
            disabled={isProcessing}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Memproses...
              </>
            ) : 'Bayar Sekarang'}
          </button>

          <button
            className="w-full py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ color: colors.brown }}
            onClick={handleCancelPayment}
            disabled={isProcessing}
          >
            {cancelLoading ? 'Membatalkan...' : 'Batalkan & Kembali'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;