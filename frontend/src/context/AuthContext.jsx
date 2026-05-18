/**
 * @file context/AuthContext.jsx
 * @description Context global untuk autentikasi pengguna.
 *
 * Menyediakan state user, status loading, dan fungsi auth (login check, logout, refetch).
 * Wrap di main.jsx di luar Routes agar bisa diakses di seluruh aplikasi.
 *
 * @example
 * // Cara pakai di komponen manapun:
 * import { useAuth } from '../context/AuthContext';
 * const { user, isLoggedIn, logout } = useAuth();
 */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "../services/apiClient";

/** Context object — jangan dipakai langsung, gunakan hook useAuth() */
const AuthContext = createContext(null);

/**
 * AuthProvider — wrap di main.jsx (di luar Routes, di dalam BrowserRouter).
 *
 * Expose:
 *   user          → object user dari /api/auth/me (null kalau belum login)
 *   isLoading     → true saat pertama kali cek session
 *   isAdmin       → shortcut: user?.role === "admin"
 *   isLoggedIn    → shortcut: user !== null
 *   refetchUser() → panggil ulang kalau perlu refresh (misal setelah update profil)
 *   logout()      → hit /api/auth/logout lalu clear state
 *
 * @param {React.ReactNode} children - Child components
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  /** true saat inisialisasi pertama kali cek session */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch data user dari endpoint /api/auth/me.
   * Dipanggil saat mount dan bisa dipanggil ulang via refetchUser().
   */
  const fetchUser = useCallback(async () => {
    try {
      const res = await apiClient.get("/api/auth/me");
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch {
      // 401 → belum login atau token expired
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cek session saat aplikasi pertama kali dimuat
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * Logout: hit endpoint backend lalu clear state user.
   * Selalu clear state meski request gagal (finally).
   */
  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/auth/logout", {});
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isLoggedIn: user !== null,
        isAdmin: user?.role === "admin",
        refetchUser: fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook untuk mengakses AuthContext.
 * Harus dipakai di dalam komponen yang dibungkus <AuthProvider>.
 *
 * @returns {{ user, isLoading, isLoggedIn, isAdmin, refetchUser, logout, setUser }}
 * @throws {Error} Jika dipakai di luar AuthProvider
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
