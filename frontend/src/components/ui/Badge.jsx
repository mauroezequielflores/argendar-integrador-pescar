/**
 * Badge — Etiqueta de estado o categoría.
 *
 * Variantes: default, orange, success, error, warning
 */
export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[#3a3a3a] text-[#A8A8AA]",
    orange:  "bg-[#FD7B03]/20 text-[#FD7B03]",
    success: "bg-green-500/20 text-green-400",
    error:   "bg-red-500/20 text-red-400",
    warning: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
