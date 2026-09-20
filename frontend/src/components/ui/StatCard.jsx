/**
 * StatCard — Tarjeta de métricas / KPI.
 *
 * Muestra un ícono representativo, etiqueta en mayúsculas, un valor numérico destacado
 * y opcionalmente un mini gráfico de barras de tendencia a la derecha.
 *
 * @param {object} props
 * @param {React.ComponentType} props.icon - Componente de ícono (ej. de Heroicons).
 * @param {string} props.label - Nombre o título de la métrica en mayúsculas.
 * @param {string|number} props.value - Valor numérico a mostrar.
 * @param {Array<{height?: number, color?: string}>|number[]} [props.trendBars] - Datos para el mini gráfico de barras.
 * @param {function} [props.onClick] - Función callback al hacer clic.
 * @param {string} [props.className] - Clases CSS adicionales.
 */
export default function StatCard({
  icon: Icon,
  label,
  value = 0,
  trendBars = [],
  onClick,
  className = "",
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={`flex flex-col justify-between rounded-[6px] border border-[#323232] bg-[#292929] p-4 transition-all duration-200 hover:border-[#3a3a3a] ${
        onClick ? "cursor-pointer hover:border-[#F78736]/50 hover:bg-[#323232]/40" : ""
      } ${className}`}
    >
      {/* Encabezado: Ícono + Etiqueta */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A8A8AA]">
        {Icon && <Icon className="h-4 w-4 shrink-0 text-[#A8A8AA]" />}
        <span className="truncate">{label}</span>
      </div>

      {/* Fila Inferior: Valor numérico + Mini gráfico de barras */}
      <div className="mt-3 flex items-end justify-between">
        <div className="text-3xl font-bold tracking-tight text-white">
          {value}
        </div>

        {/* Mini gráfico de barras de tendencia */}
        {trendBars && trendBars.length > 0 && (
          <div className="flex items-end gap-1.5 pb-1">
            {trendBars.map((bar, idx) => {
              const height = typeof bar === "number" ? bar : bar.height || 4;
              const color = typeof bar === "object" && bar.color ? bar.color : "#3a3a3a";

              return (
                <span
                  key={idx}
                  style={{ height: `${height}px`, backgroundColor: color }}
                  className="w-1.5 rounded-[1px] transition-all"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
