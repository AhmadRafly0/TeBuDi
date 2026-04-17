import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from 'axios';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });

  const [loading, setLoading] = useState(false);

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
        toast.error(errMsg)
        return;
      }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', form, { withCredentials: true });
      toast.success('Selamat datang di TeBuDi!! :D');
      navigate('/home');
    } catch (error) {
      toast.error('Email atau password salah.. :(')
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
    />
  </div>
 );
}