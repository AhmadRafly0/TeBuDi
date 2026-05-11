/**
 * @file components/auth/LoginForm.jsx
 * @description Form login dengan animasi Framer Motion.
 *
 * Komponen ini hanya bertanggung jawab untuk tampilan form.
 * Logika validasi dan submit dihandle di LoginPage (parent).
 *
 * @example
 * <LoginForm
 *   form={form}
 *   loading={loading}
 *   onChange={handleChange}
 *   onSubmit={handleSubmit}
 * />
 */

import logo from "../../assets/logo.png";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/** Animasi container: fade in + slide up */
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

/** Animasi item: fade in + slide dari kiri */
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

/**
 * Form login dengan animasi.
 *
 * @param {Object} props
 * @param {{ email: string, password: string }} props.form - State form dari parent
 * @param {boolean} props.loading - Nonaktifkan tombol saat proses login
 * @param {function} props.onChange - Handler perubahan input
 * @param {function} props.onSubmit - Handler submit form
 */
export default function LoginForm({ form, loading, onChange, onSubmit }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-[500px] p-8 bg-[#EFE9E3] rounded-3xl shadow-lg space-y-6"
    >
      {/* Logo */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <img src={logo} alt="TeBuDi Logo" className="w-100 h-40 object-contain" />
      </motion.div>

      {/* Judul */}
      <motion.div
        variants={itemVariants}
        className="text-2xl font-serif font-bold text-center text-[#5D4037]"
      >
        Selamat datang!
      </motion.div>

      <div className="space-y-4">
        {/* Input email */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              className="w-full pl-10 pr-3 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A3846B]/50 transition-all shadow-sm"
            />
          </div>
        </motion.div>

        {/* Input password */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              className="w-full pl-10 pr-3 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A3846B]/50 transition-all shadow-sm"
            />
          </div>
        </motion.div>
      </div>

      {/* Tombol submit */}
      <motion.div variants={itemVariants}>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-[#A3846B] text-white py-3 font-semibold rounded-xl hover:bg-[#D9CFC7] hover:text-black transition disabled:opacity-50 shadow-md"
        >
          {loading ? "Memproses..." : "Masuk →"}
        </button>
      </motion.div>

      {/* Link ke halaman register */}
      <motion.div
        variants={itemVariants}
        className="text-center text-sm text-stone-600"
      >
        Belum punya akun?{" "}
        <Link to="/register" className="text-[#A3846B] font-bold hover:underline">
          Daftar
        </Link>
      </motion.div>
    </motion.div>
  );
}
