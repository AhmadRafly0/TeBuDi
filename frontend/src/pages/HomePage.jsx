import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import Header from '../components/Header';
import DashboardLayout from '../components/DashbordLayout';

const books = [

 {
    id: 1,
    title: "Introduction To Java Programming",
    author: "Y. Daniel Liang",
    image: "https://covers.openlibrary.org/b/id/13097152-L.jpg"
  },

  {
    id: 2,
    title: "Software Engineering",
    author: "Ian Sommerville",
    image: "https://covers.openlibrary.org/b/id/14839714-L.jpg"
  },

  {
    id: 3,
    title: "The Double Helix",
    author: "James D. Watson",
    image: "https://covers.openlibrary.org/b/id/6492858-L.jpg"
    
  },

  {
    id: 4,
    title: "Galileo",
    author: "Stillman Drake",
    image: "https://covers.openlibrary.org/b/id/7877372-L.jpg"
    
  },


  {
    id: 5,
    title: "Childhood's End",
    author: "Arthur C. Clarke",
    image: "https://covers.openlibrary.org/b/id/15210569-L.jpg"
  },

  {
    id: 6,
    title: "2001: A Space Odyssey",
    author: "Arthur C. Clarke",
    image: "https://covers.openlibrary.org/b/id/15130153-L.jpg"
  },

  {
    id: 7,
    title: "Utopia",
    author: "Thomas More",
    image: "https://covers.openlibrary.org/b/id/13182727-L.jpg"
    
  },

  {
    id: 8,
    title: "Look Back",
    author: "Tatsuki Fujimoto",
    image: "https://covers.openlibrary.org/b/id/13594856-L.jpg"  
  }

];

export default function HomePage() {


  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Popular Books</h1>

      <div className="grid grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl shadow p-4"
          >
            <img
              src={book.image}
              className="h-60 w-60x object-cover rounded-xl mx-auto"
            />

            <h2 className="mt-3 font-bold">{book.title}</h2>
            <p className="text-gray-500">{book.author}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

