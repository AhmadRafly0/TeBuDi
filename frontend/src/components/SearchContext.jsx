import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  // Search state
  const [searchResults, setSearchResults] = useState(null); // null = not searching
  const [searchQuery, setSearchQuery] = useState("");

  // User & subscription — fetched once, shared everywhere
  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileRes, subsRes] = await Promise.allSettled([
          axios.get("/api/auth/me"),
          axios.get("/api/userSubs/status"),
        ]);

        if (profileRes.status === "fulfilled" && profileRes.value.data.success) {
          setUser(profileRes.value.data.data);
        }

        if (subsRes.status === "fulfilled" && subsRes.value.data.success) {
          setIsSubscribed(subsRes.value.data.data?.active ?? false);
        }
      } catch {
        // silently fail — Header handles redirect if needed
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SearchContext.Provider
      value={{
        // search
        searchResults, setSearchResults,
        searchQuery, setSearchQuery,
        // user
        user, setUser,
        isSubscribed, setIsSubscribed,
        userLoading,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}