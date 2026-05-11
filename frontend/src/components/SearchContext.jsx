// frontend/src/components/SearchContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const SearchContext = createContext(null);

/**
 * SearchProvider — tetap di dalam DashboardLayout seperti sebelumnya.
 * Sekarang user data diambil dari AuthContext (tidak double-fetch /api/auth/me).
 * Hanya subscription status yang masih di-fetch sendiri di sini.
 */
export function SearchProvider({ children }) {
  // Ambil user dari AuthContext yang sudah ada
  const { user, isLoading: userLoading } = useAuth();

  // Search state
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Subscription state — masih di sini karena hanya dibutuhkan di dalam layout
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchSubsStatus = async () => {
      try {
        const res = await axios.get("/api/userSubs/status", {
          withCredentials: true,
        });
        if (res.data.success) {
          setIsSubscribed(res.data.data?.active ?? false);
        }
      } catch {
        setIsSubscribed(false);
      }
    };

    // Hanya fetch kalau user sudah ada (sudah login)
    if (user) {
      fetchSubsStatus();
    }
  }, [user]);

  return (
    <SearchContext.Provider
      value={{
        // search
        searchResults,
        setSearchResults,
        searchQuery,
        setSearchQuery,
        // user (dari AuthContext, bukan fetch ulang)
        user,
        userLoading,
        // subscription
        isSubscribed,
        setIsSubscribed,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}