import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "../components/DashbordLayout";
import { Search, BookOpen, Star } from 'lucide-react';

const colors = {
  lightBeige: "#F5F1ED",
  beige: "#E2D9D0",
  brown: "#B49E88",
  textDark: "#4A3F35",
  teal: "#1a7a8a",
};


export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch data buku dari API Backend kamu
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books');
        if (response.data.success) {
          setBooks(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filter buku berdasarkan pencarian
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-[#B49E88] p-10 text-white">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-4xl font-bold mb-4">Temukan buku favoritmu.</h1>
            <p className="text-stone-100 mb-6">Akses koleksi buku digital tinggi untuk mendukung studi dan hobimu di Tebudi!</p>
            <button 
              onClick={() => navigate('/category')}
              className="bg-white text-[#4A3F35] px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition"
            >
              Jelajahi Kategori
            </button>
          </div>
          {/* Dekorasi abstrak */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Cari judul buku atau penulis..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#B49E88] outline-none"
            style={{ backgroundColor: 'white' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: colors.textDark }}>Koleksi Terbaru</h2>
          <span className="text-sm font-medium text-stone-500">{filteredBooks.length} Buku ditemukan</span>
        </div>

        {/* Book Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-4" style={{ borderColor: colors.brown }} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredBooks.map((book) => (
              <div 
                key={book.id} 
                className="group cursor-pointer"
                onClick={() => navigate(`/read/${book.id}`)}
              >
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 group-hover:-translate-y-2">
                  <img 
                    src={book.coverURL || "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="absolute inset-0 bg-opacity-0 hover:bg-black/50 transition-all flex items-center justify-center">
                    <BookOpen className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                  </div>
                </div>
                <h3 className="font-bold text-lg leading-tight mb-1 truncate" style={{ color: colors.textDark }}>
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold text-gray-600">0.0</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300">
            <p className="text-gray-500">Maaf, buku yang kamu cari tidak ditemukan.</p>
          </div>
        )}
      </div>

    
    </DashboardLayout>
  );
}

