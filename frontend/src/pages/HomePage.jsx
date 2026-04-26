import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import Header from '../components/Header';
import DashboardLayout from '../components/DashbordLayout';

export default function HomePage() {

  

  return (
      <main>
        <DashboardLayout></DashboardLayout>
      </main>
    
  );
}