import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg";

export default function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-stone-100">
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search your favourite books"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#F9F7F4] text-stone-700 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A3846B]/50 transition-all shadow-inner placeholder:text-stone-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-8 w-px bg-stone-200" />
        <div className="flex items-center gap-3 cursor-pointer group p-1 rounded-full hover:bg-stone-50 transition-all">
          <img
            src={user?.avatarURL || DEFAULT_AVATAR}
            alt={user?.username ?? "User"}
            className="h-10 w-10 rounded-full object-cover border-2 border-[#EFE9E2] shadow-sm"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#5D4037]">
              {user?.username ?? "..."}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}