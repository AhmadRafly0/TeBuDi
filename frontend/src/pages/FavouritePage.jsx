/**
 * @file pages/FavouritePage.jsx
 * @description Halaman buku favorit pengguna.
 *
 * Saat ini menampilkan data statis sebagai placeholder.
 * TODO: Fetch dari API /api/favourites untuk data dinamis per user
 */

import DashboardLayout from "../components/layout/DashboardLayout";

/**
 * Data buku favorit statis (placeholder).
 * TODO: Ganti dengan fetch dari API
 */
const FAVOURITE_BOOKS = [
  {
    id: 1,
    title: "Childhood's End",
    author: "Arthur C. Clarke",
    image: "https://covers.openlibrary.org/b/id/15210569-L.jpg",
  },
  {
    id: 2,
    title: "Introduction To Java Programming",
    author: "Y. Daniel Liang",
    image: "https://covers.openlibrary.org/b/id/13097152-L.jpg",
  },
  {
    id: 3,
    title: "Look Back",
    author: "Tatsuki Fujimoto",
    image: "https://covers.openlibrary.org/b/id/13594856-L.jpg",
  },
];

/**
 * Halaman buku favorit.
 */
export default function FavouritePage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Favourite Books</h1>

      <div className="grid grid-cols-4 gap-6">
        {FAVOURITE_BOOKS.map((book) => (
          <div key={book.id} className="bg-white rounded-2xl shadow p-4">
            <img
              src={book.image}
              alt={book.title}
              className="w-40 h-60 object-cover rounded-xl mx-auto"
            />
            <h2 className="mt-4 font-bold text-center">{book.title}</h2>
            <p className="text-gray-500 text-center">{book.author}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
