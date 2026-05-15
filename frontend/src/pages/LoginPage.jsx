/**
 * @file pages/LoginPage.jsx
 * @description Halaman login pengguna.
 *
 * Menangani validasi form, request login ke API, dan update AuthContext.
 * Tampilan form didelegasikan ke komponen LoginForm.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Komponen dan context modular
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";

/**
 * Halaman login.
 * Setelah login berhasil, update AuthContext dan redirect ke /home.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  /**
   * Validasi input form sebelum submit.
   * @returns {string|null} Pesan error, atau null jika valid
   */
  const validate = () => {
    if (!form.email || !form.password) return "Semua field harus diisi!! >:(";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Email tidak valid!! >:(";
    if (form.password.length < 8) return "Password minimal 8 karakter!! >:(";
    return null;
  };

  /** Handler perubahan input form */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Submit form login ke API.
   * Setelah berhasil, refetch user di AuthContext agar ProtectedRoute tahu user sudah login.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errMsg = validate();
    if (errMsg) {
      toast.error(errMsg);
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/login", form, { withCredentials: true });
      // Update AuthContext supaya ProtectedRoute tahu user sudah login
      await refetchUser();
      toast.success("Selamat datang di TeBuDi!! :D");
      navigate("/home");
    } catch {
      toast.error("Email atau password salah.. :(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      form={form}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
