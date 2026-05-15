/**
 * @file components/auth/RegisterForm.jsx
 * @description Form registrasi dengan layout dua kolom (desktop) dan satu kolom (mobile).
 *
 * Desktop : panel kiri berisi branding, panel kanan berisi form
 * Mobile  : hanya panel form, full-screen dengan scroll
 */

import logo from "../../assets/logo.png";
import { User, Mail, Lock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

/**
 * @param {{ form, loading, onChange, onSubmit }} props
 */
export default function RegisterForm({ form, loading, onChange, onSubmit }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F1ED] p-4">
      <div className="w-full max-w-4xl flex rounded-3xl shadow-2xl overflow-hidden">

        {/* ── Panel kiri: branding (hanya md ke atas) ── */}
        <div className="hidden md:flex md:w-2/5 bg-[#A3846B] flex-col items-center justify-center p-10 gap-6 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full" />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-white/10 rounded-full" />

          <img src={logo} alt="TeBuDi" className="w-32 object-contain relative z-10 drop-shadow-lg" />

          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-serif font-bold text-white mb-2">Bergabung!</h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              Buat akun gratis dan mulai eksplorasi ribuan buku digital bersama TeBuDi.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 mt-2">
            <BookOpen size={20} className="text-white" />
            <span className="text-white text-sm font-medium">Gratis untuk semua pengguna</span>
          </div>
        </div>

        {/* ── Panel kanan: form ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-3/5 bg-[#EFE9E3] flex flex-col justify-center p-8 md:p-10 space-y-4"
        >
          {/* Logo kecil di mobile */}
          <motion.div variants={itemVariants} className="flex md:hidden justify-center mb-1">
            <img src={logo} alt="TeBuDi" className="h-14 object-contain" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-2xl font-serif font-bold text-[#5D4037]">Daftar akun baru</h1>
            <p className="text-sm text-stone-500 mt-1">Isi data di bawah untuk membuat akun</p>
          </motion.div>

          <div className="space-y-3">
            {/* Username */}
            <motion.div variants={itemVariants} className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A3846B]/50 transition-all shadow-sm"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A3846B]/50 transition-all shadow-sm"
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="password"
                name="password"
                placeholder="Password (min. 8 karakter)"
                value={form.password}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A3846B]/50 transition-all shadow-sm"
              />
            </motion.div>

            {/* Konfirmasi password */}
            <motion.div variants={itemVariants} className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                value={form.confirmPassword}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A3846B]/50 transition-all shadow-sm"
              />
            </motion.div>
          </div>

          {/* Tombol daftar */}
          <motion.div variants={itemVariants}>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="w-full bg-[#A3846B] text-white py-3 font-semibold rounded-xl hover:bg-[#8a6d57] active:scale-95 transition-all disabled:opacity-50 shadow-md text-sm"
            >
              {loading ? "Memproses..." : "Daftar →"}
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-300" />
            <span className="text-xs text-stone-400">atau</span>
            <div className="flex-1 h-px bg-stone-300" />
          </motion.div>

          {/* Link login */}
          <motion.div variants={itemVariants} className="text-center text-sm text-stone-600">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[#A3846B] font-bold hover:underline">
              Masuk di sini
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
