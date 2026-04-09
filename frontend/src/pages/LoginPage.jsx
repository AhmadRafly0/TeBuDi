import { useState } from 'react';
import axios from 'axios';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    const validate = () => {
    if (!form.email || !form.password) {
      return "Semua field harus diisi!! >:(";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Email tidak valid!! >:(";
    }

    if (form.password.length < 8) {
      return "Password minimal 8 karakter!! >:(";
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
      const response = await axios.post('/api/auth/login', form);
      
      console.log('Login Berhasil:', response.data);
      alert('Selamat datang di TeBuDi!! :D');
      
    } catch (error) {
      console.error('Login Gagal:', error.response?.data || error.message);
      alert('Email atau password salah.. :(');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
    <LoginForm 
      form={form} 
      loading={loading} 
      onChange={handleChange} 
      onSubmit={handleSubmit} 
      error={error}
    />
  </div>
 );
}