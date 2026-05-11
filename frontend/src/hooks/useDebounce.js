/**
 * @file hooks/useDebounce.js
 * @description Custom hook untuk men-debounce sebuah nilai.
 *
 * Berguna untuk menunda eksekusi (misal: API call) sampai user
 * berhenti mengetik selama `delay` milidetik.
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 350);
 * // debouncedSearch baru berubah 350ms setelah searchTerm terakhir berubah
 */

import { useState, useEffect } from "react";

/**
 * Debounce sebuah nilai selama `delay` milidetik.
 *
 * @template T
 * @param {T} value - Nilai yang ingin di-debounce
 * @param {number} delay - Delay dalam milidetik
 * @returns {T} Nilai yang sudah di-debounce
 */
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Cleanup: batalkan timer jika value berubah sebelum delay habis
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
