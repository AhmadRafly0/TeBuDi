import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from 'axios';
import RegisterForm from "../components/RegisterForm.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      return "Semua field harus diisi!! >:(";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Email tidak valid!! >:(";
    }

    if (form.password.length < 8) {
      return "Password minimal 8 karakter!! >:(";
    }

    if (form.password !== form.confirmPassword) {
      return "Password tidak sama!! >:(";
    }

    return null;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errMsg = validate();
    if (errMsg) {
      toast.error(errMsg);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', form);
      toast.success("Registrasi berhasil!! :D");
    } catch (error) {
      const errorMsg = error.response?.data.message || "Registrasi gagal.. :(";
      toast.error(errorMsg + "! >:(");
    } finally {
      setLoading(false);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
      <RegisterForm
        form={form}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}