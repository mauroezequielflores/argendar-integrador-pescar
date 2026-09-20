/**
 * StatCard — Tarjeta de métricas / KPI.
 *
 * Muestra un ícono representativo, etiqueta en mayúsculas y un valor numérico destacado.
 * Cumple con el sistema de diseño de Argendar (#292929 fondo, texto secundario #A8A8AA, texto principal #FFFFFF).
 *
 * @param {React.ComponentType} icon - Componente de ícono (ej. de Heroicons).
 * @param {string} label - Nombre o título de la métrica en mayúsculas.
 * @param {string|number} value - Valor numérico a mostrar.
 * @param {function} [onClick] - Función callback al hacer clic.
 * @param {string} [className] - Clases CSS adicionales.
 */
export default function StatCard({
  icon: Icon,
  label,
  value = 0,
  onClick,
  className = "",
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={`rounded-[12px] border border-[#323232] bg-[#292929] p-5 transition-all duration-200 hover:border-[#3a3a3a] ${
        onClick ? "cursor-pointer hover:border-[#F78736]/50 hover:bg-[#323232]/40" : ""
      } ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A8A8AA]">
        {Icon && <Icon className="h-4 w-4 shrink-0 text-[#A8A8AA]" />}
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}

