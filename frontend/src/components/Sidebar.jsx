import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  Home, 
  LayoutGrid, 
  Library, 
  Download, 
  Headphones, 
  Heart, 
  Settings, 
  HelpCircle, 
  LogOut 
} from "lucide-react";

export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
        await axios.post('/api/auth/logout');
        toast.success("Berhasil logout!! :D")
        navigate('/login');
    } catch (error) {
        toast.error("Gagal logout!");
    }
  };

  return (
    <aside className="relative h-screen w-64 bg-[#F9F7F4] flex flex-col justify-between p-6 border-r border-stone-200">

      <div className="absolute top-0 right-[-4px] h-full border-r border-dashed border-stone-300 w-[1px]" />

      <div>

        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-8 h-8 bg-[#A3846B] rounded-lg shadow-sm" >
            <img src="https://i.pinimg.com/736x/95/fe/12/95fe1226b26f0085d2824836383f3423.jpg" alt="" />
          </div>
          <span className="text-xl font-serif font-bold text-[#5D4037]">TeBuDi</span>
        </div>


        <nav className="space-y-2 pb-20">
          <SidebarItem icon={<Home size={20} />} text="Home" to="/home" active={location.pathname === "/home"} />
          <SidebarItem icon={<LayoutGrid size={20} />} text="Category" to="/category" active={location.pathname === "/category"}/>
          <SidebarItem icon={<Library size={20} />} text="My Library" to="#" active={location.pathname === "/library"}/>          
          <SidebarItem icon={<Heart size={20} />} text="Favourite" to="/favourite" active={location.pathname === "/favourite"} />
        </nav>
        <div className="pt-0 space-y-2 border-t border-stone-200/60">
          <SidebarItem icon={<Settings size={20} />} text="Settings" to="#" active={location.pathname === "/settings"}/>
          <SidebarItem icon={<HelpCircle size={20} />} text="Support" to="#" active={location.pathname === "/support"}/>
          <SidebarItem icon={<LogOut size={20} />} text="Logout" onClick={handleLogout} />
        </div>
      </div>


      
    </aside>
  );
}

export function SidebarItem({ icon, text, active, to, onClick }) {

  if (onClick) {
    return (
      <div onClick={ onClick } className="cursor-pointer">
        <div
          className={`
            relative flex items-center py-2.5 px-4 my-1 font-medium rounded-xl cursor-pointer
            transition-all duration-200 group
            ${
              active
                ? "bg-[#EFE9E2] text-[#A3846B] shadow-sm"
                : "text-stone-500 hover:bg-[#EFE9E2]/50 hover:text-[#A3846B]"
            }
          `}
        >

          <span className={`${active ? "text-[#A3846B]" : "text-stone-400 group-hover:text-[#A3846B]"}`}>
            {icon}
          </span>
          
          <span className="ml-4 overflow-hidden transition-all">{text}</span>

          {active && (
            <div className="absolute left-0 w-1 h-6 bg-[#A3846B] rounded-r-full" />
          )}
        </div>
      </div>
    )
  }

  
  return (

    <Link to={to} className="block no-underline">
      <div
        className={`
          relative flex items-center py-2.5 px-4 my-1 font-medium rounded-xl cursor-pointer
          transition-all duration-200 group
          ${
            active
              ? "bg-[#EFE9E2] text-[#A3846B] shadow-sm"
              : "text-stone-500 hover:bg-[#EFE9E2]/50 hover:text-[#A3846B]"
          }
        `}
      >

        <span className={`${active ? "text-[#A3846B]" : "text-stone-400 group-hover:text-[#A3846B]"}`}>
          {icon}
        </span>
        
        <span className="ml-4 overflow-hidden transition-all">{text}</span>

        {active && (
          <div className="absolute left-0 w-1 h-6 bg-[#A3846B] rounded-r-full" />
        )}
      </div>
    </Link>
  );
}