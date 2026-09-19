import { useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ServiceSummaryCard from "../../../components/ui/ServiceSummaryCard";
import PaymentReceiptCard from "../../../components/ui/PaymentReceiptCard";

/**
 * PaymentSummary — Modal de detalle de confirmación de pago (Cliente).
 *
 * Se abre al clickear una notificación de tipo "payment" en NotificationsPage.
 * Muestra el resumen del servicio asociado y el comprobante detallado de la operación.
 *
 * @param {object} props
 * @param {object} props.payment — Objeto con los datos del pago y servicio
 * @param {function} props.onClose — Callback para cerrar el modal (Volver / Cancelar / Escape)
 * @param {function} props.onViewDetails — Callback para navegar al detalle del turno en agenda
 */
export default function PaymentSummary({ payment, onClose, onViewDetails }) {
  // Cerrar con Escape y bloquear scroll del body
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

  if (!payment) return null;

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
        <div className="flex flex-col gap-1 border-b border-[#323232] px-6 py-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Pago confirmado
          </h2>
          <p className="text-xs text-[#A8A8AA]">
            Se acreditó correctamente el pago de su próximo turno.
          </p>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-col gap-4 px-6 py-5 sm:px-10">
          {/* Tarjeta de resumen del servicio (componente reutilizable) */}
          <ServiceSummaryCard
            professionalName={payment.professionalName}
            professionalInitials={payment.professionalInitials}
            avatarUrl={payment.avatarUrl}
            serviceName={payment.serviceName}
            status={payment.status || "PROGRAMADO"}
            date={payment.date}
            time={payment.time}
            timeAgo={payment.timeAgo}
            onViewDetails={onViewDetails}
          />

          {/* Título de la sección de comprobante */}
          <h3 className="text-sm font-bold text-white mt-1">
            Resumen de pago:
          </h3>

          {/* Tarjeta de comprobante / detalle de la operación (componente reutilizable) */}
          <PaymentReceiptCard
            status={payment.paymentStatus || "CONFIRMADO"}
            operationNumber={payment.operationNumber}
            paymentMethod={payment.paymentMethod}
            date={payment.paymentDate || payment.date}
            amount={payment.amount}
          />
        </div>

        {/* Footer con botones de navegación */}
        <div className="flex items-center justify-between border-t border-[#323232] px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-[6px] border border-[#323232] px-3 py-2 text-xs text-[#A8A8AA] hover:text-white transition-colors bg-transparent"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Volver
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] border border-[#323232] px-3 py-2 text-xs text-[#A8A8AA] hover:text-white transition-colors bg-transparent"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
