/**
 * @file services/apiClient.js
 * @description Axios instance terpusat dengan baseURL dari env var.
 *
 * - Development: VITE_API_BASE_URL kosong → pakai Vite proxy (/api → localhost:8080)
 * - Production:  VITE_API_BASE_URL diisi URL backend → request langsung ke backend
 *
 * Auth berbasis JWT: token disimpan di localStorage, dikirim via Authorization header.
 */

import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  // withCredentials tidak diperlukan karena auth pakai JWT header, bukan session cookie
});

// Sisipkan JWT token ke setiap request jika tersedia
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
