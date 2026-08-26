/**
 * DataTable — Tabla genérica reutilizable con tema oscuro.
 *
 * @param {Array<{ key: string, label: string, render?: function, className?: string, headerClassName?: string }>} columns
 * @param {Array<object>} data
 * @param {function} [keyExtractor] - Función para extraer la clave única de cada fila.
 * @param {React.ReactNode} [emptyState] - Componente o mensaje si data está vacío.
 * @param {boolean} [isLoading] - Indica si la tabla está cargando.
 * @param {string} [className] - Clases adicionales para el contenedor.
 */
export default function DataTable({
  columns = [],
  data = [],
  keyExtractor = (item, idx) => item.id ?? idx,
  emptyState = null,
  isLoading = false,
  className = "",
}) {
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F78736] border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left text-sm text-[#A8A8AA]">
        <thead className="border-b border-[#323232] bg-[#242424]/60 text-xs font-semibold uppercase tracking-wider text-[#A8A8AA]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3.5 ${col.headerClassName || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#323232]/60">
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item, index)}
              className="transition-colors hover:bg-[#323232]/40"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3.5 align-middle ${col.className || ""}`}
                >
                  {col.render ? col.render(item, index) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
