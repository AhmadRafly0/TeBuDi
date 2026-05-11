// frontend/src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

/**
 * ProtectedRoute — hanya bisa diakses kalau sudah login.
 * Kalau belum login → redirect ke /login, sambil simpan tujuan aslinya
 * di state supaya setelah login bisa balik ke halaman yang dimaksud.
 *
 * Cara pakai di routes:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/home" element={<HomePage />} />
 *     <Route path="/profile" element={<ProfilePage />} />
 *   </Route>
 */
export function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // Tunggu cek session selesai dulu — jangan langsung redirect
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

/**
 * AdminRoute — hanya bisa diakses kalau sudah login DAN role === "admin".
 * Kalau belum login → ke /login.
 * Kalau sudah login tapi bukan admin → ke /home (forbidden).
 *
 * Cara pakai di routes:
 *   <Route element={<AdminRoute />}>
 *     <Route path="/admin/books" element={<BookManagementPage />} />
 *     <Route path="/admin/plans" element={<SubscriptionAdminPage />} />
 *   </Route>
 */
export function AdminRoute() {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Sudah login tapi bukan admin → tolak, arahkan ke home
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

/**
 * PublicOnlyRoute — hanya bisa diakses kalau BELUM login.
 * Berguna untuk /login dan /register supaya user yang sudah login
 * tidak bisa balik ke halaman login.
 *
 * Cara pakai di routes:
 *   <Route element={<PublicOnlyRoute />}>
 *     <Route path="/login" element={<LoginPage />} />
 *     <Route path="/register" element={<RegisterPage />} />
 *   </Route>
 */
export function PublicOnlyRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

// ─── Loading screen saat cek session ─────────────────────────────────────────
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