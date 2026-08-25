/**
 * Button — Botón reutilizable con variantes según el sistema de diseño Argendar.
 *
 * Variantes:
 *  - primary   → Naranja #FD7B03 (CTA principal)
 *  - secondary → Superficie oscura (acción secundaria)
 *  - ghost     → Sin fondo, borde sutil (acción terciaria / desactivado visual)
 *  - google    → Botón de OAuth Google
 *
 * Tamaños:
 *  - sm → texto pequeño, padding reducido
 *  - md → default
 *  - lg → texto grande
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  isLoading = false,
  onClick,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[6px] font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78736] focus-visible:ring-offset-2 focus-visible:ring-offset-[#202020] disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-[#F78736] text-white hover:bg-[#e06d00] active:scale-[0.98]",
    secondary:
      "bg-[#727272] text-white hover:bg-[#606060] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#A8A8AA] border border-[#3a3a3a] hover:border-[#F78736] hover:text-white",
    google:
      "bg-[#2e2e2e] text-white border border-[#3a3a3a] hover:bg-[#3a3a3a] active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-xs",
    lg: "px-6 py-3 text-xs",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} w-full ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          <span>Cargando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
