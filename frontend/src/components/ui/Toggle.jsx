/**
 * @file components/ui/Toggle.jsx
 * @description Komponen toggle switch yang reusable.
 * Digunakan di form buku (isPremium) dan form paket langganan (hasAds).
 *
 * @example
 * <Toggle checked={isPremium} onChange={(val) => setIsPremium(val)} />
 */

/**
 * Toggle switch yang accessible (role="switch", aria-checked).
 *
 * @param {Object} props
 * @param {boolean} props.checked - Status toggle (on/off)
 * @param {function} props.onChange - Callback saat toggle berubah, menerima nilai boolean baru
 * @param {boolean} [props.disabled=false] - Nonaktifkan toggle
 */
export default function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
        checked ? "bg-[#C9B59C]" : "bg-[#D9CFC7]"
      }`}
    >
      {/* Lingkaran putih yang bergerak */}
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
