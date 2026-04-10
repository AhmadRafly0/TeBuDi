import logo from "../assets/logo.png";
import { User, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegisterForm({ form, loading, onChange, onSubmit}) {
  return (
    <div className="w-full max-w-[500px] p-6 bg-[#EFE9E3] rounded-2xl shadow-md space-y-4">
      
    <div className="flex justify-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-100 h-40 object-contain"
            />
          </div>

    <div className="text-xl font-semibold text-center">
            Daftar akun baru
          </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
        </label>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
      </div>
      

      <div>
        <label htmlFor="password" className="blocktext-sm font-medium mb-1">
        </label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>
      </div>

         <div>
        <label htmlFor="password" className="blocktext-sm font-medium mb-1">
        </label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Konfirmasi Password"
            value={form.confirmPassword}
            onChange={onChange}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>
      </div>

      {/* {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )} */}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-[#A3846B] text-white py-2 rounded-lg hover:bg-[#D9CFC7] transition disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Daftar →"}
      </button>
    
      <div className="text-center text-sm">
          Sudah punya akun? {" "}
          <Link 
            to="/login" 
            className="text-[#A3846B] font-medium hover:underline"
          >
            Login
          </Link>
      </div>

  </div>
  );
}