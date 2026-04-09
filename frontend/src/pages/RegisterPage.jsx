import { useState } from "react";
import axios from 'axios';
import RegisterForm from "../components/RegisterForm.jsx";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError(errMsg);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', form);
      alert("Registrasi berhasil!! :D");
    } catch (err) {
      setError("Registrasi gagal.. :(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
      <RegisterForm
        form={form}
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
}