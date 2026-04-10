import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);


  const handleLogout = async () => {
    try {
        await axios.post('/api/auth/logout');
    } catch (error) {
        toast.error("Gagal logout!");
    } finally {
        toast.success("Berhasil logout!! :D")
        navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-8">
        <h1 className="text-2xl font-bold">Hello {user?.username}</h1>
        <button
        onClick={handleLogout}
        className="bg-red-700 text-white py-2 rounded-lg w-50 hover:bg-red-300 transition disabled:opacity-50"
        >
            logout
        </button> 
      </main>
    </div>
  );
}