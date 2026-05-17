/**
 * @file services/bookService.js
 * @description Service layer untuk semua API call yang berhubungan dengan buku.
 *
 * Memisahkan logika HTTP dari komponen UI agar komponen lebih bersih
 * dan API call mudah di-reuse atau di-mock saat testing.
 */

import apiClient from "./apiClient";

/**
 * Ambil semua buku dari server.
 * @returns {Promise<Array>} Array of book objects
 */
export async function fetchAllBooks() {
  const res = await apiClient.get("/api/books");
  return res.data?.data ?? res.data ?? [];
}

/**
 * Cari buku berdasarkan query (title, author, atau category).
 * Melakukan 3 request paralel dan menggabungkan hasilnya (deduplicated).
 *
 * @param {string} query - Kata kunci pencarian
 * @returns {Promise<Array>} Array of book objects (unique by id)
 */
export async function searchBooks(query) {
  if (!query.trim()) return [];

  const [byTitle, byAuthor, byCategory] = await Promise.allSettled([
    apiClient.get("/api/books/search", { params: { title: query } }),
    apiClient.get("/api/books/search", { params: { author: query } }),
    apiClient.get("/api/books/search", { params: { category: query } }),
  ]);

  const all = [];
  [byTitle, byAuthor, byCategory].forEach((res) => {
    if (res.status === "fulfilled") {
      all.push(...(res.value.data?.data ?? []));
    }
  });

  // Deduplicate berdasarkan id
  const seen = new Set();
  return all.filter((b) => {
    if (seen.has(b.id)) return false;
    seen.add(b.id);
    return true;
  });
}

/**
 * Tambah buku baru (dengan upload file PDF).
 * @param {FormData} formData - Data buku termasuk file PDF
 * @returns {Promise<Object>} Response data dari server
 */
export async function createBook(formData) {
  const res = await apiClient.post("/api/books", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/**
 * Update data buku yang sudah ada.
 * @param {string} bookId - ID buku yang akan diupdate
 * @param {FormData} formData - Data buku yang diupdate
 * @returns {Promise<Object>} Response data dari server
 */
export async function updateBook(bookId, formData) {
  const res = await apiClient.put(`/api/books/${bookId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/**
 * Hapus buku berdasarkan ID.
 * @param {string} bookId - ID buku yang akan dihapus
 * @returns {Promise<Object>} Response data dari server
 */
export async function deleteBook(bookId) {
  const res = await apiClient.delete(`/api/books/${bookId}`);
  return res.data;
}
