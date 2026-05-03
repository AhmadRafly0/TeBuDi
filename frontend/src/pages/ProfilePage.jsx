import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react'; // Tambahkan lucide-react untuk ikon

const colors = {
  lightBeige: "#F5F1ED",
  beige: "#E2D9D0",
  brown: "#B49E88",
  textDark: "#4A3F35",
  danger: "#e53e3e",
  teal: "#1a7a8a",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const isUpdating = useRef(false);
  const isDeleting = useRef(false);
  const fileInputRef = useRef(null); // Ref untuk input file

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false); // Loading khusus upload
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data.success) {
          setUser(response.data.data);
          setForm({
            username: response.data.data.username,
            email: response.data.data.email,
            password: '',
          });
        }
      } catch (error) {
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  // Fungsi untuk menangani perubahan foto profil
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran (contoh: max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar (Maks 2MB)");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadLoading(true);
    try {
      // Sesuaikan endpoint ini dengan backend kamu (misal: /api/users/{id}/avatar)
      const response = await axios.post(`/api/users/${user.id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setUser(prev => ({ ...prev, avatarURL: response.data.data.avatarURL }));
        toast.success("Foto profil berhasil diperbarui!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengunggah foto.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    if (isUpdating.current) return;
    isUpdating.current = true;
    setUpdateLoading(true);

    const payload = {};
    if (form.username !== user.username) payload.username = form.username;
    if (form.email !== user.email) payload.email = form.email;
    if (form.password) payload.password = form.password;

    if (Object.keys(payload).length === 0) {
      toast('Tidak ada perubahan yang perlu disimpan.', { icon: 'ℹ️' });
      isUpdating.current = false;
      setUpdateLoading(false);
      return;
    }

    try {
      const response = await axios.put(`/api/users/${user.id}`, payload);
      if (response.data.success) {
        toast.success(response.data.message || 'Profil berhasil diperbarui!');
        setUser(response.data.data);
        setForm((prev) => ({ ...prev, password: '' }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      isUpdating.current = false;
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting.current) return;
    isDeleting.current = true;
    setDeleteLoading(true);

    try {
      const response = await axios.delete(`/api/users/${user.id}`);
      if (response.data.success) {
        toast.success('Akun berhasil dihapus.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus akun.');
      isDeleting.current = false;
      setDeleteLoading(false);
    }
  };

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? '??';

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.lightBeige }}>
        <Loader2 className="animate-spin h-12 w-12" style={{ color: colors.teal }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: colors.lightBeige }}>
      <div className="max-w-lg mx-auto space-y-6">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
          style={{ color: colors.textDark }}
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8" style={{ border: `1px solid ${colors.beige}` }}>
          <div className="flex items-center gap-5 pb-6 mb-6" style={{ borderBottom: `1px solid ${colors.beige}` }}>
            
            {/* Foto Profil dengan Fungsi Ganti */}
            <div className="relative group">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              
              <div className="relative overflow-hidden rounded-full w-20 h-20 shadow-md border-2 border-white">
                {user.avatarURL ? (
                  <img
                    src={user.avatarURL}
                    alt={user.username}
                    className={`w-full h-full object-cover transition-opacity ${uploadLoading ? 'opacity-50' : 'opacity-100'}`}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xl font-bold text-white"
                    style={{ backgroundColor: colors.teal }}
                  >
                    {getInitials(user.username)}
                  </div>
                )}

                {/* Overlay Hover untuk Upload */}
                <button 
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploadLoading}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploadLoading ? <Loader2 className="animate-spin text-white" size={20} /> : <Camera className="text-white" size={20} />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-lg font-bold" style={{ color: colors.textDark }}>{user.username}</p>
              <p className="text-sm" style={{ color: colors.brown }}>{user.email}</p>
              <span
                className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: colors.beige, color: colors.textDark }}
              >
                {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {[
              { label: 'Username', name: 'username', type: 'text', minLength: 4, maxLength: 20 },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Password baru', name: 'password', type: 'password', placeholder: 'Minimal 8 karakter', hint: '(kosongkan jika tidak ingin diubah)' },
            ].map(({ label, name, type, placeholder, hint, minLength, maxLength }) => (
              <div key={name}>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: colors.brown }}>
                  {label}{' '}
                  {hint && <span className="normal-case font-normal text-gray-400">{hint}</span>}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder ?? ''}
                  minLength={minLength}
                  maxLength={maxLength}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: `1px solid ${colors.beige}`, backgroundColor: colors.lightBeige, color: colors.textDark }}
                  onFocus={e => e.target.style.borderColor = colors.brown}
                  onBlur={e => e.target.style.borderColor = colors.beige}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleUpdate}
            disabled={updateLoading}
            className="w-full mt-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: colors.teal }}
          >
            {updateLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : 'Simpan Perubahan'}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-3xl shadow-xl p-8" style={{ border: `1px solid #fecaca` }}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: colors.danger }}>
            Danger Zone
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            Menghapus akun bersifat permanen dan tidak dapat dibatalkan.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 rounded-2xl font-bold text-sm border-2 transition-all hover:bg-red-50 active:scale-95"
              style={{ borderColor: colors.danger, color: colors.danger }}
            >
              Hapus Akun
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-center" style={{ color: colors.textDark }}>
                Yakin ingin menghapus akun kamu?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-70 disabled:opacity-50"
                  style={{ color: colors.brown }}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.danger }}
                >
                  {deleteLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;