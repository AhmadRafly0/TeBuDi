/**
 * @file components/layout/Sidebar.jsx
 * @description Sidebar navigasi utama dashboard.
 *
 * Desktop  : sidebar tetap di kiri (w-64)
 * Mobile   : drawer yang muncul dari kiri, ditutup dengan overlay atau tombol X
 *
 * @example
 * // Di DashboardLayout:
 * const [sidebarOpen, setSidebarOpen] = useState(false);
 * <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
  X,
} from "lucide-react";

/**
 * Sidebar navigasi dashboard.
 *
 * @param {Object}   props
 * @param {boolean}  props.open    - Apakah drawer terbuka (mobile)
 * @param {function} props.onClose - Callback untuk menutup drawer
 */
export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil logout!! :D");
      navigate("/login");
    } catch {
      toast.error("Gagal logout!");
    }
  };

  /** Tutup drawer saat item diklik (mobile) */
  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const sidebarContent = (
    <aside className="h-full w-64 bg-[#F9F7F4] flex flex-col justify-between p-6 border-r border-stone-200">
      <div>
        {/* Logo + tombol tutup (mobile) */}
        <div className="flex items-center justify-between px-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#A3846B] rounded-lg shadow-sm overflow-hidden flex-shrink-0">
              <img
                src="https://i.pinimg.com/736x/95/fe/12/95fe1226b26f0085d2824836383f3423.jpg"
                alt="TeBuDi Logo"
              />
            </div>
            <span className="text-xl font-serif font-bold text-[#5D4037]">TeBuDi</span>
          </div>
          {/* Tombol X hanya tampil di mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu navigasi utama */}
        <nav className="space-y-1 pb-6">
          <SidebarItem
            icon={<Home size={20} />}
            text="Home"
            to="/home"
            active={location.pathname === "/home"}
            onClick={handleNavClick}
          />
          <SidebarItem
            icon={<LayoutGrid size={20} />}
            text="Category"
            to="/category"
            active={location.pathname === "/category"}
            onClick={handleNavClick}
          />
          <SidebarItem
            icon={<Library size={20} />}
            text="Subscription Plans"
            to="/subscription"
            active={location.pathname === "/subscription"}
            onClick={handleNavClick}
          />
          <SidebarItem
            icon={<Heart size={20} />}
            text="Favourite"
            to="/favourite"
            active={location.pathname === "/favourite"}
            onClick={handleNavClick}
          />
        </nav>

        {/* Menu sekunder */}
        <div className="pt-4 space-y-1 border-t border-stone-200/60">
          <SidebarItem
            icon={<Settings size={20} />}
            text="Settings"
            to="#"
            active={false}
            onClick={handleNavClick}
          />
          <SidebarItem
            icon={<HelpCircle size={20} />}
            text="Support"
            to="#"
            active={false}
            onClick={handleNavClick}
          />
          <SidebarItem
            icon={<LogOut size={20} />}
            text="Logout"
            onAction={handleLogout}
          />
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop: sidebar statis ── */}
      <div className="hidden lg:flex h-screen w-64 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* ── Mobile: drawer overlay ── */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}

/**
 * Item navigasi sidebar yang reusable.
 *
 * @param {Object}        props
 * @param {ReactNode}     props.icon     - Ikon lucide-react
 * @param {string}        props.text     - Label teks
 * @param {boolean}       [props.active] - Tandai sebagai item aktif
 * @param {string}        [props.to]     - Path navigasi (untuk link)
 * @param {function}      [props.onClick]  - Dipanggil setelah navigasi (tutup drawer)
 * @param {function}      [props.onAction] - Handler aksi langsung (logout, dll) — tidak navigasi
 */
export function SidebarItem({ icon, text, active = false, to, onClick, onAction }) {
  const itemClass = `relative flex items-center py-2.5 px-4 my-0.5 font-medium rounded-xl cursor-pointer transition-all duration-200 group ${
    active
      ? "bg-[#EFE9E2] text-[#A3846B] shadow-sm"
      : "text-stone-500 hover:bg-[#EFE9E2]/50 hover:text-[#A3846B]"
  }`;

  const iconClass = active
    ? "text-[#A3846B]"
    : "text-stone-400 group-hover:text-[#A3846B]";

  const inner = (
    <div className={itemClass}>
      {active && (
        <div className="absolute left-0 w-1 h-6 bg-[#A3846B] rounded-r-full" />
      )}
      <span className={iconClass}>{icon}</span>
      <span className="ml-4">{text}</span>
    </div>
  );

  // Aksi langsung (logout)
  if (onAction) {
    return (
      <div onClick={onAction} className="cursor-pointer">
        {inner}
      </div>
    );
  }

  // Link navigasi
  return (
    <Link to={to} className="block no-underline" onClick={onClick}>
      {inner}
    </Link>
  );
}
