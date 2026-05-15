/**
 * @file pages/RegisterPage.jsx
 * @description Halaman registrasi akun baru.
 *
 * Menangani validasi form dan request register ke API.
 * Tampilan form didelegasikan ke komponen RegisterForm.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Komponen modular
import RegisterForm from "../components/auth/RegisterForm";

/**
 * Halaman registrasi.
 * Setelah berhasil, redirect ke halaman login.
 */
export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  /**
   * Validasi input form sebelum submit.
   * @returns {string|null} Pesan error, atau null jika valid
   */
  const validate = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      return "Semua field harus diisi!! >:(";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Email tidak valid!! >:(";
    if (form.password.length < 8) return "Password minimal 8 karakter!! >:(";
    if (form.password !== form.confirmPassword) return "Password tidak sama!! >:(";
    return null;
  };

  /** Handler perubahan input form */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Submit form registrasi ke API.
   * Setelah berhasil, redirect ke halaman login.
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
      await axios.post("/api/auth/register", form);
      toast.success("Registrasi berhasil!! :D");
      navigate("/login");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registrasi gagal.. :(";
      toast.error(errorMsg + "! >:(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterForm
      form={form}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
