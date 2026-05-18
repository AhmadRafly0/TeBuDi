/**
 * @file App.jsx
 * @description Root komponen aplikasi TeBuDi.
 *
 * Mendefinisikan semua route aplikasi dengan tiga level akses:
 * - Public only: /login, /register (redirect ke /home jika sudah login)
 * - Protected: semua halaman user (butuh login)
 * - Admin only: /admin/* (butuh login + role admin)
 *
 * Juga mengkonfigurasi global toast notification.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import FavouritePage from "./pages/FavouritePage";
import CategoryPage from "./pages/CategoryPage";
import ProfilePage from "./pages/ProfilePage";
import ReadBookPage from "./pages/ReadBookPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import PaymentPage from "./pages/PaymentPage";
import BookManagementPage from "./pages/BookManagementPage";
import SubscriptionAdminPage from "./pages/SubscriptionAdminPage";

// Route guards
import {
  ProtectedRoute,
  AdminRoute,
  PublicOnlyRoute,
} from "./routes/ProtectedRoute";

/**
 * Root komponen dengan definisi routing lengkap.
 */
export default function App() {
  return (
    <>
      {/* Global toast notification */}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "16px 24px",
            minWidth: "275px",
          },
          success: { style: { border: "2px solid #22c55e" } },
          error: { style: { border: "2px solid #ef4444" } },
          loading: { style: { border: "2px solid #3b82f6" } },
        }}
      />

      <Routes>
        {/* Root → redirect ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Public only (sudah login → redirect ke /home) ── */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ── Protected (harus login) ── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/favourite" element={<FavouritePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/read/:id" element={<ReadBookPage />} />
        </Route>

        {/* ── Admin only (harus login + role === "admin") ── */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/books" element={<BookManagementPage />} />
          <Route path="/admin/plans" element={<SubscriptionAdminPage />} />
        </Route>

        {/* 404 — halaman tidak ditemukan */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <h1 style={{ fontSize: "4rem" }}>404</h1>
              <p>Halaman tidak ditemukan.</p>
              <a href="/login" style={{ color: "#B49E88" }}>
                Kembali ke Login
              </a>
            </div>
          }
        />
      </Routes>
    </>
  );
}
