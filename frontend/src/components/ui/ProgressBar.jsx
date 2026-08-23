/**
 * ProgressBar — Barra de progreso horizontal.
 *
 * @param {number} progress - Valor entre 0 y 100.
 * @param {string} className - Clases adicionales opcionales.
 */
export default function ProgressBar({ progress = 0, className = "" }) {
  // Asegurar que el progreso esté entre 0 y 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-[#3a3a3a] ${className}`}>
      <div
        className="h-full bg-[#525252]"
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
}
