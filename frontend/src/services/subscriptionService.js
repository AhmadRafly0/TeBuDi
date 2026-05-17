/**
 * @file services/subscriptionService.js
 * @description Service layer untuk API call yang berhubungan dengan langganan (subscription).
 */

import apiClient from "./apiClient";

/**
 * Ambil semua paket langganan yang tersedia.
 * @returns {Promise<Array>} Array of plan objects
 */
export async function fetchPlans() {
  const res = await apiClient.get("/api/plans");
  return res.data?.data ?? [];
}

/**
 * Tambah paket langganan baru (admin only).
 * @param {{ planName: string, price: number, durationDays: number, hasAds: boolean }} planData
 * @returns {Promise<Object>} Response data dari server
 */
export async function createPlan(planData) {
  const res = await apiClient.post("/api/plans", planData);
  return res.data;
}

/**
 * Update paket langganan yang sudah ada (admin only).
 * @param {number} planId - ID paket yang akan diupdate
 * @param {{ planName: string, price: number, durationDays: number, hasAds: boolean }} planData
 * @returns {Promise<Object>} Response data dari server
 */
export async function updatePlan(planId, planData) {
  const res = await apiClient.put(`/api/plans/${planId}`, planData);
  return res.data;
}

/**
 * Hapus paket langganan (admin only).
 * @param {number} planId - ID paket yang akan dihapus
 * @returns {Promise<Object>} Response data dari server
 */
export async function deletePlan(planId) {
  const res = await apiClient.delete(`/api/plans/${planId}`);
  return res.data;
}

/**
 * Checkout / beli paket langganan.
 * @param {number} planId - ID paket yang dipilih
 * @returns {Promise<Object>} Data transaksi (transactionId, amount, dll)
 */
export async function checkoutPlan(planId) {
  const res = await apiClient.post("/api/subscriptions/checkout", { planId });
  if (!res.data.success) throw new Error(res.data.message || "Checkout gagal.");
  return res.data.data;
}

/**
 * Konfirmasi pembayaran transaksi.
 * @param {string} transactionId - ID transaksi yang akan dikonfirmasi
 * @returns {Promise<Object>} Response data dari server
 */
export async function confirmPayment(transactionId) {
  const res = await apiClient.post("/api/subscriptions/payment-callback", { transactionId });
  if (!res.data.success) throw new Error(res.data.message || "Pembayaran gagal.");
  return res.data;
}

/**
 * Batalkan transaksi yang sedang pending.
 * @param {string} transactionId - ID transaksi yang akan dibatalkan
 * @returns {Promise<Object>} Response data dari server
 */
export async function cancelPayment(transactionId) {
  const res = await apiClient.post("/api/subscriptions/cancel", { transactionId });
  return res.data;
}

/**
 * Cek status langganan aktif pengguna.
 * @returns {Promise<boolean>} true jika langganan aktif
 */
export async function fetchSubscriptionStatus() {
  const res = await apiClient.get("/api/userSubs/status", { withCredentials: true });
  if (res.data.success) return res.data.data?.active ?? false;
  return false;
}
