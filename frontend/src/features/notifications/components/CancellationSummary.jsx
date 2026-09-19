import { useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ServiceSummaryCard from "../../../components/ui/ServiceSummaryCard";
import InfoAlert from "../../../components/ui/InfoAlert";

/**
 * CancellationSummary — Modal de detalle de cancelacion de turno (Cliente).
 *
 * Se abre al clickear una notificacion de tipo "cancellation" en NotificationsPage.
 * Muestra el resumen del servicio cancelado, el motivo del profesional y enlace a soporte.
 *
 * @param {object} cancellation — Objeto con los datos de la cancelacion
 * @param {function} onClose — Callback para cerrar el modal (Volver / Cancelar)
 * @param {function} onViewDetails — Callback para navegar al detalle del turno
 */
export default function CancellationSummary({ cancellation, onClose, onViewDetails }) {
  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay click para cerrar */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor del modal */}
      <div className="relative z-10 w-full max-w-[646px] overflow-hidden rounded-[16px] border border-[#323232] bg-[#202020] shadow-2xl">

        {/* Encabezado principal */}
        <div className="flex flex-col gap-2 border-b border-[#323232] px-6 py-4">
          <h2 className="text-lg font-bold text-white">Turno cancelado</h2>
          <p className="text-xs text-[#A8A8AA]">
            El profesional cancelo tu turno programado para el {cancellation.date} a las {cancellation.time}.
          </p>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-col gap-4 px-6 py-5 sm:px-10">

          {/* Texto introductorio */}
          <p className="text-sm font-bold text-white">
            El profesional {cancellation.professionalName} ha cancelado tu turno.
          </p>

          {/* Tarjeta de resumen del servicio (componente reutilizable) */}
          <ServiceSummaryCard
            professionalName={cancellation.professionalName}
            professionalInitials={cancellation.professionalInitials}
            avatarUrl={cancellation.avatarUrl}
            serviceName={cancellation.serviceName}
            status={cancellation.status}
            date={cancellation.date}
            time={cancellation.time}
            timeAgo={cancellation.timeAgo}
            onViewDetails={onViewDetails}
          />

          {/* Motivo de cancelacion */}
          <h3 className="text-sm font-bold text-white mt-2">
            Motivo de Cancelacion.
          </h3>

          {/* Recuadro de texto con el motivo */}
          <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-4">
            <p className="text-sm text-[#A8A8AA] leading-relaxed">
              {cancellation.cancellationReason}
            </p>
          </div>

          {/* Alerta informativa de soporte */}
          <InfoAlert>
            Si sentis que hubo un error, no dudes en comunicarte con soporte en{" "}
            <a
              href="mailto:argendarsoporte@gmail.com"
              className="underline hover:text-white transition-colors"
            >
              argendarsoporte@gmail.com
            </a>
          </InfoAlert>
        </div>

        {/* Footer con botones de navegacion */}
        <div className="flex items-center justify-between border-t border-[#323232] px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-[6px] border border-transparent px-3 py-2 text-xs text-[#A8A8AA] hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Volver
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] border border-[#323232] px-3 py-2 text-xs text-[#A8A8AA] hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
