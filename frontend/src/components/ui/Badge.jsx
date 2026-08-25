/**
 * Badge — Etiqueta de estado o categoría.
 *
 * Variantes: default, orange, success, error, warning
 */
export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[#323232] text-[#A8A8AA]",
    orange:  "bg-[#F78736]/20 text-[#F78736]",
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
