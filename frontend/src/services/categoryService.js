/**
 * @file services/categoryService.js
 * @description Service layer untuk semua API call yang berhubungan dengan kategori.
 */

import apiClient from "./apiClient";

/**
 * Ambil semua kategori dari server.
 * @returns {Promise<Array>} Array of category objects { idCategory, nameCategory }
 */
export async function fetchAllCategories() {
  const res = await apiClient.get("/api/categories");
  return res.data?.data ?? res.data ?? [];
}

/**
 * Cari buku berdasarkan nama kategori.
 * @param {string} categoryName - Nama kategori
 * @returns {Promise<Array>} Array of book objects
 */
export async function fetchBooksByCategory(categoryName) {
  const res = await apiClient.get("/api/books/search", {
    params: { category: categoryName },
  });
  return res.data?.data ?? res.data ?? [];
}
