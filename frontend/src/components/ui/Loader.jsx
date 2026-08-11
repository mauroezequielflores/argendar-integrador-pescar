/**
 * Loader — Spinner de carga circular.
 *
 * Variantes: sm, md (default), lg
 */
export default function Loader({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };

  return (
    <div
      role="status"
      aria-label="Cargando"
      className={`animate-spin rounded-full border-[#FD7B03] border-t-transparent ${sizes[size]} ${className}`}
    />
  );
}
