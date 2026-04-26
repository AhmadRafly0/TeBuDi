import DashboardLayout from "../components/DashbordLayout";

const books = [

  {
    id: 1,
    title: "Childhood's End",
    author: "Arthur C. Clarke",
    image: "https://covers.openlibrary.org/b/id/15210569-L.jpg",
    favourite: true
  },

  {
    id: 2,
    title: "Introduction To Java Programming",
    author: "Y. Daniel Liang",
    image: "https://covers.openlibrary.org/b/id/13097152-L.jpg",
    favourite: false
  },

  {
    id: 3,
    title: "Look Back",
    author: "Tatsuki Fujimoto",
    image: "https://covers.openlibrary.org/b/id/13594856-L.jpg",
    favourite: true
  }

];

export default function FavouritePage() {
  const favouriteBooks = books.filter(book => book.favourite);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Favourite Books</h1>

      <div className="grid grid-cols-4 gap-6">
        {favouriteBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl shadow p-4"
          >
            <img
              src={book.image}
              className="w-40 h-60 object-cover rounded-xl mx-auto"
            />

            <h2 className="mt-4 font-bold text-center">
              {book.title}
            </h2>

            <p className="text-gray-500 text-center">
              {book.author}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}