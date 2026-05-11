/**
 * @file components/ui/Field.jsx
 * @description Wrapper form field yang reusable dengan label, hint, dan tanda required.
 * Digunakan di BookModal dan PlanModal untuk konsistensi tampilan form.
 *
 * @example
 * <Field label="Judul" required hint="Maks. 100 karakter">
 *   <input className={inputCls} ... />
 * </Field>
 */

/**
 * Form field wrapper dengan label dan hint opsional.
 *
 * @param {Object} props
 * @param {string} props.label - Label field
 * @param {boolean} [props.required=false] - Tampilkan tanda bintang merah jika true
 * @param {React.ReactNode} props.children - Input element
 * @param {string} [props.hint] - Teks hint kecil di bawah input
 */
export default function Field({ label, required = false, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {/* Tanda wajib diisi */}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {/* Teks hint opsional */}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

/**
 * Class Tailwind standar untuk input field di seluruh aplikasi.
 * Export sebagai konstanta agar konsisten di semua form.
 */
export const inputCls =
  "w-full px-3 py-2 text-sm border border-[#D9CFC7] rounded bg-white text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#C9B59C] focus:ring-1 focus:ring-[#C9B59C] transition disabled:bg-gray-100";
