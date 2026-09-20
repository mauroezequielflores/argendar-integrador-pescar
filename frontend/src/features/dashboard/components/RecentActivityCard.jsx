import { UserMinusIcon } from "@heroicons/react/24/outline";
import ActivityTable from "./ActivityTable";

/**
 * RecentActivityCard — Tarjeta contenedora de la sección "Actividad Reciente" (CA04).
 *
 * Muestra el encabezado con el enlace "Ver todo", y renderiza:
 * - El Empty State idéntico a la captura cuando activities está vacío.
 * - La tabla estructurada con columnas y badges cuando hay actividades disponibles.
 *
 * @param {object} props
 * @param {Array<object>} [props.activities] - Lista de actividades recientes.
 * @param {boolean} [props.isLoading=false] - Estado de carga.
 * @param {function} [props.onViewAll] - Callback al presionar "Ver todo".
 */
export default function RecentActivityCard({
  activities = [],
  isLoading = false,
  onViewAll,
}) {
  const hasActivities = activities.length > 0;

  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5 sm:p-6">
      {/* ── Encabezado de la tarjeta ──────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-white">
          Actividad reciente
        </h2>
        <button
          onClick={onViewAll}
          type="button"
          className="text-xs text-[#A8A8AA] transition-colors hover:text-white"
        >
          Ver todo
        </button>
      </div>

      {/* ── Contenido: Tabla o Empty State (CA04) ──────────────── */}
      <div className="min-h-[340px] rounded-[6px] bg-[#202020] p-4 flex flex-col justify-center">
        {hasActivities ? (
          <div className="overflow-hidden rounded-[6px]">
            <ActivityTable activities={activities} isLoading={isLoading} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            {/* Ícono centrado con círculo oscuro */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#292929] border border-[#323232]">
              <UserMinusIcon className="h-5 w-5 text-[#A8A8AA]" />
            </div>
            <h3 className="mt-3 text-sm sm:text-base font-bold text-white">
              No hay actividad reciente
            </h3>
            <p className="mt-1 text-xs text-[#A8A8AA] max-w-sm">
              No encontramos actividad para mostrar en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
