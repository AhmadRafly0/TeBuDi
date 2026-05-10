// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

/**
 * AuthProvider — wrap di App.jsx (di luar Routes, di dalam BrowserRouter).
 *
 * Expose:
 *   user          → object user dari /api/auth/me (null kalau belum login)
 *   isLoading     → true saat pertama kali cek session
 *   isAdmin       → shortcut: user?.role === "admin"
 *   isLoggedIn    → shortcut: user !== null
 *   refetchUser() → panggil ulang kalau perlu refresh (misal setelah update profil)
 *   logout()      → hit /api/auth/logout lalu clear state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true saat inisialisasi

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch {
      // 401 → belum login, bukan error fatal
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } finally {
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}