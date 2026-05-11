/**
 * @file pages/CategoryPage.jsx
 * @description Halaman daftar kategori buku.
 *
 * Saat ini menampilkan kategori statis.
 * TODO: Ganti dengan data dinamis dari API /api/categories
 */

import DashboardLayout from "../components/layout/DashboardLayout";

/**
 * Daftar kategori buku yang tersedia.
 * TODO: Fetch dari API agar dinamis
 */
const CATEGORIES = [
  "Programming",
  "Technology",
  "Science",
  "Science Fiction",
  "Philosophy",
  "Manga",
  "Classics",
];

/**
 * Halaman kategori buku.
 */
export default function CategoryPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      <div className="grid grid-cols-3 gap-6">
        {CATEGORIES.map((cat, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow hover:scale-105 transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-center">{cat}</h2>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
