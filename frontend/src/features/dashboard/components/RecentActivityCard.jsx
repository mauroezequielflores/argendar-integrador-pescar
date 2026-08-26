import { EyeSlashIcon } from "@heroicons/react/24/outline";
import ActivityTable from "./ActivityTable";

/**
 * RecentActivityCard — Tarjeta contenedora de la sección "Actividad Reciente".
 *
 * Muestra el encabezado con el enlace "Ver todo", y renderiza:
 * - El Empty State fiel a la captura cuando activities está vacío.
 * - La tabla con columnas y badges (CA03) cuando hay actividades disponibles.
 *
 * @param {Array<object>} activities - Lista de actividades.
 * @param {boolean} isLoading - Estado de carga.
 * @param {function} [onViewAll] - Callback al presionar "Ver todo".
 */
export default function RecentActivityCard({
  activities = [],
  isLoading = false,
  onViewAll,
}) {
  const hasActivities = activities.length > 0;

  return (
    <div className="rounded-[16px] border border-[#323232] bg-[#292929] p-6">
      {/* ── Encabezado de la tarjeta ──────────────────────────── */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-semibold text-white">Actividad reciente</h2>
        <button
          onClick={onViewAll}
          type="button"
          className="text-xs text-[#A8A8AA] transition-colors hover:text-white"
        >
          Ver todo
        </button>
      </div>

      {/* ── Contenido: Tabla o Empty State ─────────────────────── */}
      <div className="min-h-[380px] rounded-[12px] bg-[#202020] p-4 flex flex-col justify-center">
        {hasActivities ? (
          <div className="overflow-hidden rounded-[8px]">
            <ActivityTable activities={activities} isLoading={isLoading} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            {/* Ícono centrado con círculo oscuro */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292929] border border-[#323232]">
              <EyeSlashIcon className="h-6 w-6 text-[#A8A8AA]" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">
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
