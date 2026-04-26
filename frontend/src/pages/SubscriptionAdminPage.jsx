import React, { useState, useEffect } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Table from '../components/Table'; 

// modal form tambah/edit paket
const PlanFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({ planName: '', price: '', durationDays: '', hasAds: false });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({ planName: '', price: '', durationDays: '', hasAds: false });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.planName || formData.price === '' || formData.durationDays === '') {
      return toast.error("Semua field harus diisi!! >:(");
    }
    if (Number(formData.price) < 0) {
      return toast.error("Harga tidak valid!! >:(");
    }
    if (Number(formData.durationDays) < 1) {
      return toast.error("Durasi minimal 1 hari!! >:(");
    }

    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      durationDays: parseInt(formData.durationDays, 10)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
      <div className="bg-[#F9F8F6] rounded-lg shadow-xl w-full max-w-md border border-[#D9CFC7] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-[#D9CFC7] bg-[#EFE9E3]">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData ? 'Edit Paket' : 'Tambah Paket Baru'}
          </h2>
          <button onClick={onClose} disabled={loading} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
            <input 
              type="text" 
              value={formData.planName}
              disabled={loading}
              onChange={(e) => setFormData({...formData, planName: e.target.value})}
              className="w-full p-2 border border-[#D9CFC7] rounded bg-white focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] disabled:bg-gray-100"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (IDR)</label>
              <input 
                type="number" 
                value={formData.price}
                disabled={loading}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full p-2 border border-[#D9CFC7] rounded bg-white focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Hari)</label>
              <input 
                type="number" 
                value={formData.durationDays}
                disabled={loading}
                onChange={(e) => setFormData({...formData, durationDays: e.target.value})}
                className="w-full p-2 border border-[#D9CFC7] rounded bg-white focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input 
              type="checkbox" 
              id="hasAds"
              checked={formData.hasAds}
              disabled={loading}
              onChange={(e) => setFormData({...formData, hasAds: e.target.checked})}
              className="h-4 w-4 text-[#C9B59C] focus:ring-[#C9B59C] border-[#D9CFC7] rounded cursor-pointer"
            />
            <label htmlFor="hasAds" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Sertakan Iklan
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#D9CFC7] mt-6">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-[#D9CFC7] text-gray-600 rounded hover:bg-[#EFE9E3] transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#C9B59C] text-white rounded hover:bg-[#b09b82] transition-colors shadow-sm disabled:opacity-50 min-w-[100px]"
            >
              {loading ? 'Proses...' : (initialData ? 'Simpan' : 'Tambah')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// modal konfirmasi hapus
const ConfirmModal = ({ isOpen, onClose, onConfirm, planName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F9F8F6] rounded-lg shadow-xl w-full max-w-sm border border-[#D9CFC7] overflow-hidden text-center">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Hapus Paket</h2>
          <p className="text-gray-600 text-sm">
            Apakah kamu yakin ingin menghapus "{planName}"? Data yang dihapus tidak bisa dikembalikan.
          </p>
        </div>
        <div className="bg-[#EFE9E3] p-4 flex justify-center gap-3 border-t border-[#D9CFC7]">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-[#D9CFC7] bg-white text-gray-600 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 min-w-[120px]"
          >
            {loading ? 'Proses...' : 'Hapus Paket'}
          </button>
        </div>
      </div>
    </div>
  );
};

// halaman utama admin mengelola langganan
export default function SubscriptionAdminPage() {
  const [plans, setPlans] = useState([]);
  
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const fetchPlans = async () => {
    setPageLoading(true);
    try {
      const response = await axios.get('/api/plans');
      setPlans(response.data.data);
    } catch (error) {
      toast.error("Gagal memuat data paket.. :(");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSavePlan = async (planData) => {
    setActionLoading(true);
    try {
      if (editingPlan) {
        await axios.put(`/api/plans/${editingPlan.planId}`, planData);
        toast.success('Paket berhasil diubah!! :D');
      } else {
        await axios.post('/api/plans', planData);
        toast.success('Paket berhasil ditambahkan!! :D');
      }
      setIsFormOpen(false);
      fetchPlans();
    } catch (error) {
      toast.error(editingPlan ? 'Gagal mengubah paket.. :(' : 'Gagal membuat paket.. :(');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/plans/${planToDelete.planId}`);
      toast.success('Paket berhasil dihapus!! :D');
      setIsConfirmOpen(false);
      setPlanToDelete(null);
      fetchPlans();
    } catch (error) {
      toast.error('Gagal menghapus paket.. :(');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans">
      <Toaster position="bottom-right" />
      
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Paket Langganan</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola pilihan paket membaca untuk platform TeBuDi.</p>
          </div>
          <button 
            onClick={() => { setEditingPlan(null); setIsFormOpen(true); }}
            className="bg-[#C9B59C] hover:bg-[#b09b82] text-white px-5 py-2.5 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            <span>Tambah Paket Baru</span>
          </button>
        </div>

        {pageLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9B59C]"></div>
          </div>
        ) : (
          <Table 
            plans={plans} 
            onEdit={(plan) => { setEditingPlan(plan); setIsFormOpen(true); }} 
            onDelete={(plan) => { setPlanToDelete(plan); setIsConfirmOpen(true); }} 
          />
        )}
      </div>

      <PlanFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingPlan}
        onSubmit={handleSavePlan}
        loading={actionLoading}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeletePlan}
        planName={planToDelete?.planName}
        loading={actionLoading}
      />
    </div>
  );
}