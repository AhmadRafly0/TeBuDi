import DashboardLayout from "../components/DashbordLayout";

const categories = [
  "Programming",
  "Technology",
  "Science",
  "Science Fiction",
  "Philosophy",
  "Manga",
  "Classics"
];

export default function CategoryPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        Categories
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow hover:scale-105 transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-center">
              {cat}
            </h2>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}