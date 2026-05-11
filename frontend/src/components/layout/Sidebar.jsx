/**
 * @file components/layout/Sidebar.jsx
 * @description Sidebar navigasi utama dashboard.
 *
 * Menampilkan logo, menu navigasi, dan tombol logout.
 * Menggunakan useLocation untuk menandai item aktif.
 */

import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  LayoutGrid,
  Library,
  Heart,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

/**
 * Sidebar navigasi dashboard.
 * Harus digunakan di dalam AuthProvider.
 */
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  /**
   * Handle logout: panggil logout dari AuthContext,
   * tampilkan toast, lalu redirect ke halaman login.
   */
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil logout!! :D");
      navigate("/login");
    } catch {
      toast.error("Gagal logout!");
    }
  };

  return (
    <aside className="relative h-screen w-64 bg-[#F9F7F4] flex flex-col justify-between p-6 border-r border-stone-200">
      {/* Garis dekoratif kanan */}
      <div className="absolute top-0 right-[-4px] h-full border-r border-dashed border-stone-300 w-[1px]" />

      <div>
        {/* Logo TeBuDi */}
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-8 h-8 bg-[#A3846B] rounded-lg shadow-sm overflow-hidden">
            <img
              src="https://i.pinimg.com/736x/95/fe/12/95fe1226b26f0085d2824836383f3423.jpg"
              alt="TeBuDi Logo"
            />
          </div>
          <span className="text-xl font-serif font-bold text-[#5D4037]">TeBuDi</span>
        </div>

        {/* Menu navigasi utama */}
        <nav className="space-y-2 pb-20">
          <SidebarItem
            icon={<Home size={20} />}
            text="Home"
            to="/home"
            active={location.pathname === "/home"}
          />
          <SidebarItem
            icon={<LayoutGrid size={20} />}
            text="Category"
            to="/category"
            active={location.pathname === "/category"}
          />
          <SidebarItem
            icon={<Library size={20} />}
            text="Subscription Plans"
            to="/subscription"
            active={location.pathname === "/subscription"}
          />
          <SidebarItem
            icon={<Heart size={20} />}
            text="Favourite"
            to="/favourite"
            active={location.pathname === "/favourite"}
          />
        </nav>

        {/* Menu sekunder (settings, support, logout) */}
        <div className="pt-0 space-y-2 border-t border-stone-200/60">
          <SidebarItem
            icon={<Settings size={20} />}
            text="Settings"
            to="#"
            active={location.pathname === "/settings"}
          />
          <SidebarItem
            icon={<HelpCircle size={20} />}
            text="Support"
            to="#"
            active={location.pathname === "/support"}
          />
          <SidebarItem
            icon={<LogOut size={20} />}
            text="Logout"
            onClick={handleLogout}
          />
        </div>
      </div>
    </aside>
  );
}

/**
 * Item navigasi sidebar yang reusable.
 * Mendukung dua mode: link navigasi (to) atau tombol aksi (onClick).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Ikon lucide-react
 * @param {string} props.text - Label teks
 * @param {boolean} [props.active=false] - Tandai sebagai item aktif
 * @param {string} [props.to] - Path navigasi (gunakan ini untuk link)
 * @param {function} [props.onClick] - Handler klik (gunakan ini untuk aksi seperti logout)
 */
export function SidebarItem({ icon, text, active = false, to, onClick }) {
  /** Class Tailwind untuk item aktif dan tidak aktif */
  const itemClass = `relative flex items-center py-2.5 px-4 my-1 font-medium rounded-xl cursor-pointer transition-all duration-200 group ${
    active
      ? "bg-[#EFE9E2] text-[#A3846B] shadow-sm"
      : "text-stone-500 hover:bg-[#EFE9E2]/50 hover:text-[#A3846B]"
  }`;

  const iconClass = active
    ? "text-[#A3846B]"
    : "text-stone-400 group-hover:text-[#A3846B]";

  const content = (
    <div className={itemClass}>
      <span className={iconClass}>{icon}</span>
      <span className="ml-4 overflow-hidden transition-all">{text}</span>
      {/* Indikator aktif di sisi kiri */}
      {active && (
        <div className="absolute left-0 w-1 h-6 bg-[#A3846B] rounded-r-full" />
      )}
    </div>
  );

  // Mode tombol (untuk logout, dll)
  if (onClick) {
    return (
      <div onClick={onClick} className="cursor-pointer">
        {content}
      </div>
    );
  }

  // Mode link navigasi
  return (
    <Link to={to} className="block no-underline">
      {content}
    </Link>
  );
}
