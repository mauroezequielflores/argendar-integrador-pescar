import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ServiceSummaryCard from "../../../components/ui/ServiceSummaryCard";
import RatingInput from "../../../components/ui/RatingInput";
import ChipGroup from "../../../components/ui/ChipGroup";

const DEFAULT_TAGS = [
  "Puntualidad",
  "Profesionalismo",
  "Amabilidad",
  "Instalaciones",
  "Explicación clara",
  "Precio justo",
];

/**
 * RatingModal — Modal para calificar un servicio recibido (Cliente).
 *
 * Cumple con los criterios CA01 a CA07:
 * - Resumen del servicio con status "FINALIZADO"
 * - Selector interactivo de estrellas (obligatorio)
 * - Chips de tags de puntos fuertes (selección múltiple)
 * - Textarea de opinión pública con contador de caracteres (0/500)
 * - Botones de navegación y envío con validación
 *
 * @param {object} props
 * @param {object} props.notification — Objeto con datos del turno a calificar
 * @param {function} props.onClose — Callback para cerrar el modal
 * @param {function} props.onViewDetails — Callback para navegar a los detalles del turno
 * @param {function} props.onSubmitSuccess — Callback invocado al enviar la calificación con éxito
 */
export default function RatingModal({
  notification,
  onClose,
  onViewDetails,
  onSubmitSuccess,
}) {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(["Amabilidad"]);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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

  if (!notification) return null;

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      setErrorMessage("Por favor seleccioná al menos 1 estrella para enviar tu calificación.");
      return;
    }

    setErrorMessage("");
    setIsSuccess(true);

    if (onSubmitSuccess) {
      onSubmitSuccess({
        rating,
        tags: selectedTags,
        comment,
        notificationId: notification.id,
      });
    }

    // Cerrar tras breve confirmación
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const professionalName = notification.professionalName || "el profesional";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay click para cerrar */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor del modal */}
      <div className="relative z-10 w-full max-w-[646px] my-8 overflow-hidden rounded-[16px] border border-[#323232] bg-[#202020] shadow-2xl">
        {/* Encabezado principal */}
        <div className="flex flex-col gap-1 border-b border-[#323232] px-6 py-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Calificar Turno
          </h2>
          <p className="text-xs text-[#A8A8AA]">
            Tu opinión nos ayuda a mejorar la calidad de los servicios.
          </p>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-col gap-5 px-6 py-5 sm:px-10">
          {/* Pregunta introductoria (CA03) */}
          <h3 className="text-sm sm:text-base font-bold text-white">
            ¿Cómo fue tu experiencia con {professionalName}?
          </h3>

          {/* Tarjeta de resumen del servicio (CA03) */}
          <ServiceSummaryCard
            professionalName={notification.professionalName}
            professionalInitials={notification.professionalInitials}
            avatarUrl={notification.avatarUrl}
            serviceName={notification.serviceName || "Instalación eléctrica"}
            status={notification.status || "FINALIZADO"}
            date={notification.date}
            time={notification.time}
            timeAgo={notification.timeAgo}
            onViewDetails={onViewDetails}
          />

          {/* Formulario principal de calificación */}
          <div className="flex flex-col gap-6 rounded-[6px] border border-[#323232] bg-[#292929] p-5 sm:p-6">
            {/* Sección 1: Estrellas (CA04) */}
            <div className="flex flex-col items-center text-center gap-1.5">
              <h4 className="text-sm sm:text-base font-bold text-white">
                ¿Cómo calificarías este servicio?
              </h4>
              <p className="text-xs text-[#A8A8AA]">
                Toca las estrellas para dar tu puntaje
              </p>
              <div className="mt-2">
                <RatingInput
                  value={rating}
                  onChange={(val) => {
                    setRating(val);
                    if (errorMessage) setErrorMessage("");
                  }}
                  size="lg"
                />
              </div>
            </div>

            <div className="border-t border-[#323232]" />

            {/* Sección 2: Tags de Puntos Fuertes (CA05) */}
            <div className="flex flex-col gap-1.5">
              <h4 className="text-sm font-bold text-white">
                ¿Qué fue lo que más te gusto?
              </h4>
              <p className="text-xs text-[#A8A8AA] leading-relaxed">
                Selecciona una o más opciones que destaquen en tu experiencia. Ayuda a otros clientes seleccionando los puntos fuertes.
              </p>
              <div className="mt-2">
                <ChipGroup
                  options={DEFAULT_TAGS}
                  selectedValues={selectedTags}
                  onToggle={handleToggleTag}
                />
              </div>
            </div>

            <div className="border-t border-[#323232]" />

            {/* Sección 3: Opinión Escrita (CA06) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white">Tu opinión</h4>
                <span className="text-xs text-[#A8A8AA]">(Opcional)</span>
              </div>
              <p className="text-xs text-[#A8A8AA]">
                Tu opinión será pública para otros usuarios.
              </p>
              <div className="mt-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  placeholder="Cuéntanos más sobre tu experiencia. ¿Qué te gustó o qué podríamos mejorar?"
                  rows={4}
                  className="w-full resize-none rounded-[6px] border border-[#323232] bg-[#202020] p-3 text-xs sm:text-sm text-white placeholder-[#727272] focus:border-[#F78736] focus:outline-none transition-colors leading-relaxed"
                />
                <div className="mt-1 text-right text-[11px] text-[#727272]">
                  {comment.length}/500
                </div>
              </div>
            </div>

            {/* Mensaje de error de validación */}
            {errorMessage && (
              <p className="text-center text-xs font-medium text-[#EF4444]">
                {errorMessage}
              </p>
            )}

            {/* Mensaje de éxito al enviar */}
            {isSuccess && (
              <p className="text-center text-xs font-semibold text-[#4CAF50]">
                ¡Calificación enviada con éxito! Gracias por compartir tu experiencia.
              </p>
            )}
          </div>
        </div>

        {/* Footer con botones de navegación (CA07) */}
        <div className="flex items-center justify-between border-t border-[#323232] px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-[6px] border border-[#323232] px-3 py-2 text-xs text-[#A8A8AA] hover:text-white transition-colors bg-transparent"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Volver
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[6px] border border-[#323232] px-3 py-2 text-xs text-[#A8A8AA] hover:text-white transition-colors bg-transparent"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSuccess}
              className="rounded-[6px] bg-[#F78736] px-4 py-2 text-xs font-bold text-white hover:bg-[#e07328] transition-colors shadow-sm disabled:opacity-50"
            >
              Enviar Calificación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
