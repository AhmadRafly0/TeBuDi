import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegisterForm({ form, loading, onChange, onSubmit, error }) {
  return (
    <div className="w-full max-w-[500px] p-6 bg-[#EFE9E3] rounded-2xl shadow-md space-y-4">
      
      <div className="text-xl font-semibold text-center">
        Daftar akun baru
      </div>




      <input
      type="username"
      name="username"
      placeholder="Masukan username!!!!!"
      value={form.username}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg"
      
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg"
      />
      

      {/* Password */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg"
      />

      {/* Confirm Password */}
      <input
        type="password"
        name="confirmPassword"
        placeholder="Konfirmasi Password"
        value={form.confirmPassword}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg"
      />

    {error && (
      <div className="text-red-500 text-sm text-center">
        {error}
      </div>
    )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-[#A3846B] text-white py-2 rounded-lg"
      >
        {loading ? "Memproses..." : "Daftar"}
      </button>
    </div>
  );
}