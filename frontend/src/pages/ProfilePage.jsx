/**
 * @file pages/ProfilePage.jsx
 * @description Halaman profil pengguna — responsif untuk mobile, tablet, dan desktop.
 *
 * Fitur:
 * - Tampilkan dan edit data profil (username, email, password)
 * - Upload/ganti foto profil
 * - Hapus akun (dengan konfirmasi)
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Camera, Loader2, User, Mail, Lock, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";

/**
 * Ambil inisial nama untuk avatar placeholder.
 */
function getInitials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "??"
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isUpdating = useRef(false);
  const isDeleting = useRef(false);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        if (response.data.success) {
          setUser(response.data.data);
          setForm({
            username: response.data.data.username,
            email: response.data.data.email,
            password: "",
          });
        }
      } catch {
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar (Maks 2MB)");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setUploadLoading(true);
    try {
      const response = await axios.post(`/api/users/${user.id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setUser((prev) => ({ ...prev, avatarURL: response.data.data.avatarURL }));
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
      toast("Tidak ada perubahan yang perlu disimpan.", { icon: "ℹ️" });
      isUpdating.current = false;
      setUpdateLoading(false);
      return;
    }

    try {
      const response = await axios.put(`/api/users/${user.id}`, payload);
      if (response.data.success) {
        toast.success(response.data.message || "Profil berhasil diperbarui!");
        setUser(response.data.data);
        setForm((prev) => ({ ...prev, password: "" }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
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
        await logout();
        toast.success("Akun berhasil dihapus.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus akun.");
      isDeleting.current = false;
      setDeleteLoading(false);
    }
  };

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1ED]">
        <Loader2 className="animate-spin h-12 w-12 text-[#A3846B]" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Tombol kembali */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-sm font-semibold text-[#4A3F35] hover:text-[#A3846B] transition-colors hover:gap-3"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </button>

        {/* ── Kartu profil utama ── */}
        <div className="bg-white rounded-2xl shadow-md border border-[#E2D9D0] overflow-hidden">

          {/* Banner atas */}
          <div className="h-24 md:h-32 bg-gradient-to-r from-[#A3846B] to-[#C9B59C] relative">
            <div className="absolute -bottom-10 left-6 md:left-8">
              {/* Avatar */}
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <div className="relative w-20 h-20 rounded-full shadow-lg border-4 border-white overflow-hidden">
                  {user.avatarURL ? (
                    <img
                      src={user.avatarURL}
                      alt={user.username}
                      className={`w-full h-full object-cover transition-opacity ${uploadLoading ? "opacity-50" : "opacity-100"}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white bg-[#A3846B]">
                      {getInitials(user.username)}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploadLoading}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Ganti foto profil"
                  >
                    {uploadLoading ? (
                      <Loader2 className="animate-spin text-white" size={18} />
                    ) : (
                      <Camera className="text-white" size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info user */}
          <div className="pt-14 px-6 md:px-8 pb-6">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-[#4A3F35]">{user.username}</h1>
                <p className="text-sm text-[#B49E88] mt-0.5">{user.email}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#E2D9D0] text-[#4A3F35]">
                <Shield size={12} />
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* ── Form edit profil ── */}
        <div className="bg-white rounded-2xl shadow-md border border-[#E2D9D0] p-6 md:p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#B49E88] mb-5">
            Edit Profil
          </h2>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  minLength={4}
                  maxLength={20}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-[#E2D9D0] bg-[#F5F1ED] text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#A3846B]/40 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-[#E2D9D0] bg-[#F5F1ED] text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#A3846B]/40 transition-all"
                />
              </div>
            </div>

            {/* Password baru */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                Password baru{" "}
                <span className="font-normal text-stone-400">(kosongkan jika tidak diubah)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-[#E2D9D0] bg-[#F5F1ED] text-[#4A3F35] focus:outline-none focus:ring-2 focus:ring-[#A3846B]/40 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Tombol simpan */}
          <button
            onClick={handleUpdate}
            disabled={updateLoading}
            className="w-full mt-6 py-3 rounded-xl font-bold text-white text-sm bg-[#A3846B] hover:bg-[#8a6d57] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            {updateLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Simpan Perubahan"}
          </button>
        </div>

        {/* ── Danger Zone ── */}
        <div className="bg-white rounded-2xl shadow-md border border-red-100 p-6 md:p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-1">
            Danger Zone
          </h2>
          <p className="text-sm text-stone-400 mb-5">
            Menghapus akun bersifat permanen dan tidak dapat dibatalkan.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 rounded-xl font-bold text-sm border-2 border-red-400 text-red-500 hover:bg-red-50 active:scale-95 transition-all"
            >
              Hapus Akun
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-center text-[#4A3F35]">
                Yakin ingin menghapus akun kamu?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-[#B49E88] border border-[#E2D9D0] hover:bg-stone-50 transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Ya, Hapus"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
