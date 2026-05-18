/**
 * @file context/SearchContext.jsx
 * @description Context untuk state pencarian buku dan status langganan.
 *
 * Digunakan di dalam DashboardLayout agar Header dan halaman utama
 * bisa berbagi state pencarian tanpa prop drilling.
 *
 * Mengambil data user dari AuthContext (tidak double-fetch /api/auth/me).
 * Hanya subscription status yang di-fetch sendiri di sini.
 *
 * @example
 * import { useSearch } from '../context/SearchContext';
 * const { searchResults, setSearchResults, isSubscribed } = useSearch();
 */

import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import { useAuth } from "./AuthContext";

/** Context object — gunakan hook useSearch() */
const SearchContext = createContext(null);

/**
 * SearchProvider — wrap di dalam DashboardLayout.
 * Tidak perlu di-wrap di level App karena hanya dibutuhkan di halaman dashboard.
 *
 * @param {React.ReactNode} children
 */
export function SearchProvider({ children }) {
  // Ambil user dari AuthContext yang sudah ada (tidak double-fetch)
  const { user, isLoading: userLoading } = useAuth();

  /** Hasil pencarian: null (idle), "loading" (fetching), atau array buku */
  const [searchResults, setSearchResults] = useState(null);
  /** Query pencarian aktif */
  const [searchQuery, setSearchQuery] = useState("");

  /** Status langganan aktif pengguna */
  const [isSubscribed, setIsSubscribed] = useState(false);

  /**
   * Fetch status langganan dari API.
   * Hanya dijalankan setelah user tersedia (sudah login).
   */
  useEffect(() => {
    const fetchSubsStatus = async () => {
      try {
        const res = await apiClient.get("/api/userSubs/status");
        if (res.data.success) {
          setIsSubscribed(res.data.data?.active ?? false);
        }
      } catch {
        setIsSubscribed(false);
      }
    };

    if (user) {
      fetchSubsStatus();
    }
  }, [user]);

  return (
    <SearchContext.Provider
      value={{
        // State pencarian
        searchResults,
        setSearchResults,
        searchQuery,
        setSearchQuery,
        // Data user (dari AuthContext, bukan fetch ulang)
        user,
        userLoading,
        // Status langganan
        isSubscribed,
        setIsSubscribed,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

/**
 * Hook untuk mengakses SearchContext.
 * Harus dipakai di dalam komponen yang dibungkus <SearchProvider>.
 *
 * @returns {{ searchResults, setSearchResults, searchQuery, setSearchQuery, user, userLoading, isSubscribed, setIsSubscribed }}
 */
export function useSearch() {
  return useContext(SearchContext);
}
