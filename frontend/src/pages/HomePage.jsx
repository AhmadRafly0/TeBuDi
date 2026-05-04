import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "../components/DashbordLayout";
import { Search, BookOpen, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';

const colors = {
  lightBeige: "#F5F1ED",
  beige: "#E2D9D0",
  brown: "#B49E88",
  textDark: "#4A3F35",
  teal: "#1a7a8a",
};

const CATEGORIES = [
  { value: 1, label: "Fiksi" },
  { value: 2, label: "Non-Fiksi" },
  { value: 3, label: "Sains" },
  { value: 4, label: "Teknologi" },
  { value: 5, label: "Sejarah" },
];

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedBook, setSelectedBook] = useState(null);
  
  const navigate = useNavigate();

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

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (catValue) => {
    return CATEGORIES.find(c => c.value === catValue)?.label || "Kategori Umum";
  };

  const handleReadClick = async (book) => {
    if (!book.isPremium) {
      navigate(`/read/${book.id}`);
      return;
    }

    try {
      const response = await axios.get('/api/userSubs/status');
      
      if (response.data.success) {
        const isSubscribed = response.data.data.active;
        
        if (isSubscribed) {
          navigate(`/read/${book.id}`);
        } else {
          toast.error("Buku ini khusus pengguna Premium. Silakan berlangganan terlebih dahulu.", { id: 'premium-toast' });
          navigate('/subscription');
        }
      }
    } catch (error) {
      toast.error("Gagal memeriksa status langganan. Pastikan kamu sudah login.", { id: 'status-error' });
    }
  };

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
                onClick={() => setSelectedBook(book)} /* BUKA MODAL DI SINI */
              >
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 group-hover:-translate-y-2">
                  <img 
                    src={book.coverURL || "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  
                  {/* Badge Premium/Gratis di atas Cover */}
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm z-10 ${
                      book.isPremium ? "bg-amber-400 text-amber-950" : "bg-emerald-400 text-emerald-950"
                    }`}
                  >
                    {book.isPremium ? "Premium" : "Gratis"}
                  </span>

                  <div className="absolute inset-0 bg-opacity-0 hover:bg-black/50 transition-all flex items-center justify-center">
                    <BookOpen className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                  </div>
                </div>
                <h3 className="font-bold text-lg leading-tight mb-1 truncate" style={{ color: colors.textDark }}>
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 truncate">{book.author}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold text-gray-600">4.8</span>
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

      {/* 
        MODAL POP-UP DESKRIPSI BUKU 
      */}
      {selectedBook && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setSelectedBook(null)}
        >
          <div className="relative w-full max-w-2xl bg-[#F9F7F4] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Tombol Close (Mobile) */}
            <button 
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 z-20 md:hidden bg-white/80 p-1.5 rounded-full text-stone-700"
            >
              <X size={20} />
            </button>

            {/* Sisi Kiri: Cover Buku */}
            <div className="w-full md:w-2/5 bg-stone-200 relative aspect-[3/4] md:aspect-auto">
              <img 
                src={selectedBook.coverURL || "https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"} 
                alt={selectedBook.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
            </div>

            {/* Sisi Kanan: Konten & Deskripsi */}
            <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
              <div>
                {/* Tombol Close (Desktop) */}
                <div className="hidden md:flex justify-end -mt-2 -mr-2 mb-2">
                  <button onClick={() => setSelectedBook(null)} className="text-stone-400 hover:text-stone-700 transition">
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-2">
                   <span className="text-xs font-bold tracking-widest text-[#B49E88] uppercase">
                     {getCategoryName(selectedBook.category)}
                   </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-[#4A3F35] leading-tight mb-2">
                  {selectedBook.title}
                </h2>
                
                <p className="text-stone-500 font-medium mb-4">
                  Oleh <span className="text-[#1a7a8a]">{selectedBook.author}</span>
                </p>

                {/* Badge Premium / Gratis */}
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      selectedBook.isPremium ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {selectedBook.isPremium ? (
                      <>
                        <Star size={12} className="fill-amber-500 text-amber-500"/> Akses Premium
                      </>
                    ) : (
                      "Baca Gratis"
                    )}
                  </span>
                </div>

                {/* Deskripsi Buku */}
                <div className="prose prose-sm text-stone-600 mb-8 line-clamp-6">
                  <p>
                    {selectedBook.description || "Buku ini tidak memiliki deskripsi. Mari mulai membaca untuk mengetahui isinya secara langsung."}
                  </p>
                </div>
              </div>

              {/* Tombol Action */}
              <div className="mt-auto pt-4">
                <button 
                  onClick={() => handleReadClick(selectedBook)}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-2 ${
                    selectedBook.isPremium ? "bg-[#B49E88]" : "bg-[#1a7a8a]"
                  }`}
                >
                  <BookOpen size={20} />
                  {selectedBook.isPremium ? "Baca Buku Premium" : "Baca Sekarang"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

