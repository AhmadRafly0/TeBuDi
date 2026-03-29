import { useState } from 'react';
import axios from 'axios';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', form);
      
      console.log('Login Berhasil:', response.data);
      alert('Selamat datang di TeBuDi!');
      
    } catch (error) {
      console.error('Login Gagal:', error.response?.data || error.message);
      alert('Email atau password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <LoginForm 
        form={form} 
        loading={loading} 
        onChange={handleChange} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
}