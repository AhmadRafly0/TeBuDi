/**
 * @file pages/ProfilePage.jsx
 * @description Halaman profil pengguna.
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
import { ArrowLeft, Camera, Loader2 } from "lucide-react";

// Context modular
import { useAuth } from "../context/AuthContext";

/**
 * Halaman profil pengguna.
 * Fetch data profil dari /api/auth/me saat mount.
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Ref untuk mencegah double submit
  const isUpdating = useRef(false);
  const isDeleting = useRef(false);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch data profil saat mount
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

  /**
   * Handle upload foto profil.
   * Validasi ukuran file (maks. 2MB) sebelum upload.
   */
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

  /** Handler perubahan input form */
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Update data profil ke API.
   * Hanya mengirim field yang berubah.
   */
  const handleUpdate = async () => {
    if (isUpdating.current) return;
    isUpdating.current = true;
    setUpdateLoading(true);

    // Bangun payload hanya dari field yang berubah
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

  /**
   * Hapus akun pengguna secara permanen.
   * Setelah berhasil, logout dan redirect ke login.
   */
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

  /**
   * Ambil inisial nama untuk avatar placeholder.
   * @param {string} name
   * @returns {string} Maks. 2 karakter kapital
   */
  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "??";

  // Loading state saat fetch profil
  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F5F1ED" }}
      >
        <Loader2 className="animate-spin h-12 w-12" style={{ color: "#A3846B" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-50 bg-stone-50">
      <div className="max-w-200 mx-auto space-y-6">

        {/* Tombol kembali */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
          style={{ color: "#4A3F35" }}
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </button>

        {/* Kartu profil */}
        <div
          className="bg-white rounded-3xl shadow-xl p-8"
          style={{ border: "1px solid #E2D9D0" }}
        >
          {/* Header profil: avatar + info */}
          <div
            className="flex items-center gap-5 pb-6 mb-6"
            style={{ borderBottom: "1px solid #E2D9D0" }}
          >
            {/* Avatar dengan tombol upload */}
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
                    className={`w-full h-full object-cover transition-opacity ${
                      uploadLoading ? "opacity-50" : "opacity-100"
                    }`}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-xl font-bold text-white"
                    style={{ backgroundColor: "#A3846B" }}
                  >
                    {getInitials(user.username)}
                  </div>
                )}
                {/* Overlay hover untuk upload */}
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploadLoading}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploadLoading ? (
                    <Loader2 className="animate-spin text-white" size={20} />
                  ) : (
                    <Camera className="text-white" size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Info user */}
            <div>
              <p className="text-lg font-bold" style={{ color: "#4A3F35" }}>
                {user.username}
              </p>
              <p className="text-sm" style={{ color: "#B49E88" }}>
                {user.email}
              </p>
              <span
                className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#E2D9D0", color: "#4A3F35" }}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* Form edit profil */}
          <div className="space-y-5">
            {[
              { label: "Username", name: "username", type: "text", minLength: 4, maxLength: 20 },
              { label: "Email", name: "email", type: "email" },
              {
                label: "Password baru",
                name: "password",
                type: "password",
                placeholder: "Minimal 8 karakter",
                hint: "(kosongkan jika tidak ingin diubah)",
              },
            ].map(({ label, name, type, placeholder, hint, minLength, maxLength }) => (
              <div key={name}>
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "#B49E88" }}
                >
                  {label}{" "}
                  {hint && (
                    <span className="normal-case font-normal text-gray-400">
                      {hint}
                    </span>
                  )}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder ?? ""}
                  minLength={minLength}
                  maxLength={maxLength}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: "1px solid #E2D9D0",
                    backgroundColor: "#F5F1ED",
                    color: "#4A3F35",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#B49E88")}
                  onBlur={(e) => (e.target.style.borderColor = "#E2D9D0")}
                />
              </div>
            ))}
          </div>

          {/* Tombol simpan */}
          <button
            onClick={handleUpdate}
            disabled={updateLoading}
            className="w-full mt-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: "#A3846B" }}
          >
            {updateLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>

        {/* Danger Zone: hapus akun */}
        <div
          className="bg-white rounded-3xl shadow-xl p-8"
          style={{ border: "1px solid #fecaca" }}
        >
          <h2
            className="text-sm font-bold uppercase tracking-widest mb-1"
            style={{ color: "#e53e3e" }}
          >
            Danger Zone
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            Menghapus akun bersifat permanen dan tidak dapat dibatalkan.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 rounded-2xl font-bold text-sm border-2 transition-all hover:bg-red-50 active:scale-95"
              style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
            >
              Hapus Akun
            </button>
          ) : (
            <div className="space-y-3">
              <p
                className="text-sm font-semibold text-center"
                style={{ color: "#4A3F35" }}
              >
                Yakin ingin menghapus akun kamu?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-70 disabled:opacity-50"
                  style={{ color: "#B49E88" }}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#e53e3e" }}
                >
                  {deleteLoading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
