import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import Header from '../components/Header';
import DashboardLayout from '../components/DashbordLayout';

export default function HomePage() {
  // const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const response = await axios.get('/api/auth/me');
  //       if (response.data.success) {
  //         setUser(response.data.data);
  //       }
  //     } catch (error) {
  //       navigate('/login');
  //     }
  //   };
  //   fetchProfile();
  // }, [navigate]);


  

  return (
      <main>
        <DashboardLayout></DashboardLayout>
      </main>
    
  );
}