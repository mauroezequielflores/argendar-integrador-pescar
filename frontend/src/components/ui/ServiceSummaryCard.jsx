import { ArrowRightIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import Avatar from "./Avatar";

/**
 * ServiceSummaryCard — Tarjeta reutilizable de resumen de servicio.
 *
 * Muestra avatar del profesional, nombre del servicio, badge de estado,
 * nombre del profesional, fecha/hora y boton "Ver detalle".
 *
 * Utilizado en modales de notificaciones (ReminderSummary, CancellationSummary, etc.)
 * y en paginas de detalle de turno.
 */
export default function ServiceSummaryCard({
  professionalName,
  professionalInitials,
  avatarUrl,
  serviceName,
  status,
  date,
  time,
  timeAgo,
  onViewDetails,
}) {
  return (
    <div className="flex flex-col rounded-[6px] border border-[#323232] bg-[#292929] p-4">
      {/* Fila superior: avatar + info + timeAgo */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* Avatar del profesional */}
          <Avatar
            initials={professionalInitials}
            avatarUrl={avatarUrl}
            size="lg"
          />

          {/* Nombre del servicio + badge + nombre profesional */}
          <div className="flex flex-col mt-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-white">{serviceName}</h3>
              <span className="rounded-[6px] border border-[#A8A8AA] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#A8A8AA]">
                {status}
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-white">
              {professionalName}
            </p>
          </div>
        </div>

        {/* Antiguedad */}
        <div className="flex shrink-0 items-center gap-1.5 text-[10px] text-[#A8A8AA]">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* Fila inferior: fecha + boton Ver detalle */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pl-[88px]">
        <span className="flex items-center gap-2 text-xs text-[#A8A8AA]">
          <CalendarDaysIcon className="h-4 w-4 text-[#F78736]" />
          {date} {time}
        </span>

        {onViewDetails && (
          <button
            type="button"
            onClick={onViewDetails}
            className="flex items-center gap-2 rounded-[6px] border border-[#727272] px-3 py-2 text-xs font-medium text-white hover:border-white transition-colors bg-transparent"
          >
            Ver detalle <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
