/**
 * @file pages/PaymentPage.jsx
 * @description Halaman konfirmasi dan pembayaran transaksi langganan — responsif.
 *
 * Menerima data transaksi dari SubscriptionPage via router state.
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, CreditCard, ArrowLeft } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { confirmPayment, cancelPayment } from "../services/subscriptionService";

const formatPrice = (amount) => `Rp ${Number(amount).toLocaleString("id-ID")}`;

export default function PaymentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const transaction = state?.transaction;

  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!transaction) {
    navigate("/subscription");
    return null;
  }

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      await confirmPayment(transaction.transactionId);
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
      await cancelPayment(transaction.transactionId);
      navigate("/subscription");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Gagal membatalkan pembayaran.");
      setCancelLoading(false);
    }
  };

  const isProcessing = loading || cancelLoading;

  // ── Halaman sukses ──
  if (success) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="w-full max-w-sm mx-auto text-center bg-white rounded-2xl md:rounded-3xl shadow-md border border-[#E2D9D0] p-8 md:p-10">
            {/* Ikon sukses */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mx-auto mb-5">
              <CheckCircle size={36} className="text-emerald-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#4A3F35] mb-2">
              Pembayaran Berhasil!
            </h2>
            <p className="text-sm text-gray-400 mb-8">
              Langganan{" "}
              <span className="font-semibold text-[#B49E88]">{transaction.planName}</span>{" "}
              kamu sekarang aktif.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="w-full py-3 rounded-xl font-bold text-white bg-[#A3846B] hover:bg-[#8a6d57] active:scale-95 transition-all shadow-md"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Halaman konfirmasi ──
  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">

        {/* Tombol kembali */}
        <button
          onClick={() => navigate("/subscription")}
          className="group flex items-center gap-2 mb-6 text-sm font-semibold text-[#4A3F35] hover:text-[#A3846B] transition-colors"
        >
          <div className="p-1.5 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all border border-[#E2D9D0]">
            <ArrowLeft size={16} className="text-[#B49E88]" />
          </div>
          Kembali ke Paket
        </button>

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-md border border-[#E2D9D0] overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#A3846B] to-[#C9B59C] px-6 py-5 text-white text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 mb-3">
              <CreditCard size={20} className="text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-extrabold">Konfirmasi Pembayaran</h1>
            <p className="text-white/70 text-xs mt-1">
              Selesaikan pembayaran untuk mengaktifkan langganan
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* Ringkasan pesanan */}
            <div className="bg-[#F5F1ED] rounded-xl p-5 mb-6 space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#B49E88] mb-3">
                Ringkasan Pesanan
              </h3>

              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500">Paket</span>
                <span className="font-semibold text-[#4A3F35]">{transaction.planName}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500">Status</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  {transaction.status}
                </span>
              </div>

              <div className="flex justify-between items-start text-sm gap-4">
                <span className="text-stone-500 flex-shrink-0">ID Transaksi</span>
                <span className="font-mono text-xs text-stone-400 text-right break-all">
                  {transaction.transactionId}
                </span>
              </div>

              {/* Total */}
              <div className="border-t border-[#E2D9D0] pt-3 mt-1 flex justify-between items-center">
                <span className="font-bold text-[#4A3F35]">Total</span>
                <span className="text-xl md:text-2xl font-extrabold text-[#4A3F35]">
                  {formatPrice(transaction.amount)}
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3 rounded-xl text-sm text-center font-medium bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}

            {/* Tombol aksi */}
            <div className="space-y-3">
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full py-3 md:py-4 rounded-xl font-bold text-white bg-[#A3846B] hover:bg-[#8a6d57] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Bayar Sekarang"
                )}
              </button>

              <button
                onClick={handleCancelPayment}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl font-semibold text-sm text-[#B49E88] border border-[#E2D9D0] hover:bg-[#F5F1ED] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelLoading ? "Membatalkan..." : "Batalkan & Kembali"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
