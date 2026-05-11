/**
 * @file routes/ProtectedRoute.jsx
 * @description Route guards untuk mengontrol akses halaman berdasarkan status autentikasi.
 *
 * Tiga jenis guard:
 * - ProtectedRoute: hanya bisa diakses jika sudah login
 * - AdminRoute: hanya bisa diakses jika sudah login DAN role === "admin"
 * - PublicOnlyRoute: hanya bisa diakses jika BELUM login (untuk /login, /register)
 *
 * Semua guard menampilkan loading screen saat session sedang dicek.
 *
 * @example
 * // Di App.jsx:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/home" element={<HomePage />} />
 * </Route>
 *
 * <Route element={<AdminRoute />}>
 *   <Route path="/admin/books" element={<BookManagementPage />} />
 * </Route>
 *
 * <Route element={<PublicOnlyRoute />}>
 *   <Route path="/login" element={<LoginPage />} />
 * </Route>
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Guard untuk halaman yang membutuhkan login.
 * Jika belum login → redirect ke /login, sambil simpan tujuan asli di state
 * agar setelah login bisa balik ke halaman yang dimaksud.
 */
export function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // Tunggu cek session selesai — jangan langsung redirect
  if (isLoading) return <AuthLoadingScreen />;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

/**
 * Guard untuk halaman admin.
 * Jika belum login → redirect ke /login.
 * Jika sudah login tapi bukan admin → redirect ke /home (forbidden).
 */
export function AdminRoute() {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoadingScreen />;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Sudah login tapi bukan admin → tolak akses
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

/**
 * Guard untuk halaman publik (login, register).
 * Jika sudah login → redirect ke /home agar tidak bisa balik ke halaman login.
 */
export function PublicOnlyRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <AuthLoadingScreen />;

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

/**
 * Loading screen yang ditampilkan saat session sedang dicek.
 * Mencegah flash redirect sebelum status auth diketahui.
 */
function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#F9F7F4]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#B49E88]" />
        <p className="text-sm text-stone-400 font-medium">Memuat...</p>
      </div>
    </div>
  );
}
