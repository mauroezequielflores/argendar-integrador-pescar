import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequestDetail, useCreateOffer } from "../hooks/useMarketplaceQueries";
import { api } from "../../../libs/axios";
import { createOfferFormSchema } from "../../../validations/offer.schema";
import { ROUTES } from "../../../constants/routes";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Modales Reutilizables
function SuccessModal({ isOpen, onOffers, onHome }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-[6px] bg-white p-6 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#292929]">
          <CheckCircleIcon className="h-8 w-8 text-white" />
        </div>
        <p className="mb-6 text-sm text-gray-500">
          Tu oferta ha sido enviada al cliente. Te notificaremos cuando haya una respuesta.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onOffers}
            className="w-full rounded-[6px] bg-[#F78736] py-3 text-sm font-bold text-white hover:bg-[#e06d00] transition-colors"
          >
            Ir a mis ofertas
          </button>
          <button
            onClick={onHome}
            className="w-full rounded-[6px] border-2 border-gray-300 bg-white py-3 text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorModal({ isOpen, message, onRetry, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-[6px] bg-white p-6 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#292929]">
          <ExclamationTriangleIcon className="h-8 w-8 text-white" />
        </div>
        <p className="mb-6 text-sm text-gray-500">
          {message || "Hubo un problema técnico al procesar tu solicitud. Por favor, intenta de nuevo en unos minutos."}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full rounded-[6px] bg-[#F78736] py-3 text-sm font-bold text-white hover:bg-[#e06d00] transition-colors"
          >
            Reintentar
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-[6px] border-2 border-gray-300 bg-white py-3 text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// Helpers
function timeSince(fechaISO) {
  if (!fechaISO) return "";
  const date = new Date(fechaISO);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = seconds / 86400;
  if (interval > 1) return `Publicado hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `Publicado hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `Publicado hace ${Math.floor(interval)} min`;
  return "Publicado hace unos instantes";
}

function formatDateDisplay(dateString) {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export default function CreateOfferPage() {
  const { solicitudId } = useParams();
  const navigate = useNavigate();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createOfferFormSchema),
    defaultValues: {
      proposedDate: "",
      proposedTime: "",
      amount: "",
      proposedDeposit: "",
      message: "",
    }
  });

  const formValues = watch();

  // Fetch Request Details
  const { data: requestData, isLoading: isLoadingRequest } = useRequestDetail(solicitudId);

  const reqDetail = requestData?.data;

  // Submit Mutation
  const createOfferMutation = useCreateOffer();

  const handleOfferError = (error) => {
    const backendMessage = error.response?.data?.error?.message;
    if (backendMessage) {
      setErrorMessage(backendMessage);
    } else {
      setErrorMessage("Hubo un problema técnico al procesar tu solicitud. Por favor, intenta de nuevo en unos minutos.");
    }
    setShowError(true);
  };

  const onSubmit = (data) => {
    // Mapear rango horario a HH:mm como requiere backend
    let timeStr = "08:00"; // fallback
    if (data.proposedTime === "Mañana 08:00 - 12:00") timeStr = "08:00";
    if (data.proposedTime === "Tarde 12:00 - 17:00") timeStr = "12:00";
    if (data.proposedTime === "Noche 17:00 - 21:00") timeStr = "17:00";

    const payload = {
      requestId: solicitudId,
      proposedDate: data.proposedDate,
      proposedTime: timeStr,
      amount: Number(data.amount),
      proposedDeposit: data.proposedDeposit ? Number(data.proposedDeposit) : 0,
      message: data.message || "",
    };

    createOfferMutation.mutate(payload, {
      onSuccess: () => setShowSuccess(true),
      onError: handleOfferError,
    });
  };

  return (
    <div className="flex flex-col gap-6 text-white pb-10">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-2 text-xs text-[#A8A8AA]">
          <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate(ROUTES.PROFESSIONAL_MARKETPLACE)}>Solicitud</span>
          <span>&gt;</span>
          <span className="text-white">Crear oferta</span>
        </nav>
        <h1 className="text-2xl font-bold mt-2">Crear oferta</h1>
        <p className="text-sm text-[#A8A8AA]">Revisá la información de solicitud y resumen antes de enviar tu Oferta.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Columna Izquierda: Formulario */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Bloqueo si ya tiene oferta */}
          {reqDetail?.hasOffer ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-white border border-[#323232] bg-[#202020] rounded-[6px] mt-6">
              <h2 className="text-xl font-bold mb-2">Ya hiciste una oferta</h2>
              <p className="text-sm text-[#A8A8AA] mb-6">Ya enviaste una propuesta para esta solicitud.</p>
              <button
                onClick={() => navigate('/professional/agenda', { state: { activeTab: 'ofertas' } })}
                className="rounded-[6px] bg-[#F78736] px-6 py-2 text-sm font-medium transition-colors hover:bg-orange-500"
              >
                Ver mis ofertas pendientes
              </button>
            </div>
          ) : (
            <form id="offer-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            
            {/* Fecha y Horario */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold">Proponer una fecha</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A8AA]" />
                  <input
                    type="date"
                    {...register("proposedDate")}
                    className="w-full rounded-[6px] border border-[#323232] bg-[#202020] py-2.5 pl-10 pr-3 text-sm focus:border-[#F78736] focus:outline-none"
                  />
                </div>
                {errors.proposedDate && <span className="text-xs text-red-500">{errors.proposedDate.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold">Rango horario de la oferta <span className="text-red-500">*</span></label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A8AA]" />
                  <select
                    {...register("proposedTime")}
                    className="w-full rounded-[6px] border border-[#323232] bg-[#202020] py-2.5 pl-10 pr-3 text-sm appearance-none focus:border-[#F78736] focus:outline-none text-[#A8A8AA] focus:text-white"
                  >
                    <option value="" disabled>Seleccionar un rango</option>
                    <option value="Mañana 08:00 - 12:00">Mañana 08:00 - 12:00</option>
                    <option value="Tarde 12:00 - 17:00">Tarde 12:00 - 17:00</option>
                    <option value="Noche 17:00 - 21:00">Noche 17:00 - 21:00</option>
                  </select>
                </div>
                {errors.proposedTime && <span className="text-xs text-red-500">{errors.proposedTime.message}</span>}
              </div>
            </div>

            {/* Precios */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-semibold">Precio total</label>
                <input
                  type="number"
                  placeholder="Ej: $ 45.000"
                  {...register("amount", { valueAsNumber: true })}
                  className="w-full rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2.5 text-sm focus:border-[#F78736] focus:outline-none placeholder-[#A8A8AA]"
                />
                {errors.amount && <span className="text-xs text-red-500">{errors.amount.message}</span>}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-semibold">Monto de la seña</label>
                <input
                  type="number"
                  placeholder="Ej: $ 5.000"
                  {...register("proposedDeposit", { valueAsNumber: true })}
                  className="w-full rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2.5 text-sm focus:border-[#F78736] focus:outline-none placeholder-[#A8A8AA]"
                />
                {errors.proposedDeposit && <span className="text-xs text-red-500">{errors.proposedDeposit.message}</span>}
              </div>
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold">Descripción de la oferta</label>
              <textarea
                rows={4}
                placeholder="Ej: Puedo pasar mañana..."
                {...register("message")}
                className="w-full rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2.5 text-sm focus:border-[#F78736] focus:outline-none placeholder-[#A8A8AA] resize-none"
              ></textarea>
              {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
            </div>
          </form>
          )}

          {/* Solicitud ofertada (Card estática sin botón ver detalle activo) */}
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-xs font-semibold">Solicitud ofertada</p>
            {isLoadingRequest ? (
              <div className="rounded-[6px] bg-[#292929] p-4 text-center text-sm">Cargando solicitud...</div>
            ) : reqDetail ? (
              <div className="rounded-[6px] border border-[#323232] bg-[#292929] flex flex-col pointer-events-none opacity-80">
                <div className="flex items-center justify-between border-b border-[#323232] px-4 py-2 text-[10px] uppercase font-semibold text-[#A8A8AA] tracking-wide">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[4px] border border-[#404040] px-1.5 py-0.5">PUBLICADA</span>
                    <span className="rounded-[4px] border border-[#404040] px-1.5 py-0.5">{reqDetail.categoria}</span>
                    <span className="flex items-center gap-1 rounded-[4px] border border-[#404040] px-1.5 py-0.5">
                      <MapPinIcon className="h-3 w-3" />
                      {reqDetail.ubicacion}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{timeSince(reqDetail.fecha)}</span>
                  </div>
                </div>
                <div className="px-4 pt-4 pb-4 flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-[#A8A8AA]"></div>
                  <div className="flex-1 flex flex-col gap-1">
                    <h4 className="text-base font-bold text-white">{reqDetail.titulo}</h4>
                    <p className="text-xs text-[#A8A8AA] leading-relaxed line-clamp-2">
                      {reqDetail.descripcion}
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4 flex items-center justify-between border-t border-[#323232] pt-3">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      Preferencia: {reqDetail.cuestionario?.cuandoLoNecesita || 'Soy flexible'}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#A8A8AA]"></span>
                    <span className="flex items-center gap-1 text-white">
                      <ClockIcon className="h-3 w-3" />
                      ESPERANDO OFERTAS...
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#A8A8AA] border border-[#404040] px-2 py-1 rounded-[4px]">Ver detalle -&gt;</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Columna Derecha: Resumen Panel Fijo */}
        <div className="w-full lg:w-[350px] shrink-0">
          <div className="sticky top-6 flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-6">
            <h3 className="text-lg font-bold">Resumen de tu oferta</h3>
            
            {/* Header del profesional (Hardcodeado segun diseño) */}
            <div className="flex items-center gap-3 border border-[#404040] rounded-[6px] p-3 mt-2">
              <div className="h-10 w-10 shrink-0 rounded-full bg-[#323232] flex items-center justify-center overflow-hidden">
                <UserIcon className="h-6 w-6 text-[#A8A8AA]" />
              </div>
              <div>
                <p className="text-sm font-bold flex items-center gap-2">
                  Ricardo Gómez <span className="text-[10px] tracking-wide text-white">★★★★☆</span>
                </p>
                <p className="text-[10px] text-[#A8A8AA] tracking-wider uppercase font-semibold">Electricista</p>
              </div>
            </div>

            {/* Valores en Tiempo Real */}
            <div className="flex flex-col mt-2">
              <div className="flex justify-between items-center py-3 border-b border-[#323232]">
                <span className="text-xs text-[#A8A8AA] font-semibold">Precio total</span>
                <span className="text-sm font-bold">${formValues.amount ? Number(formValues.amount).toLocaleString("es-AR") : "0"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#323232]">
                <span className="text-[10px] text-[#A8A8AA] font-bold uppercase tracking-wide">Monto de la seña</span>
                <span className="text-sm font-bold text-[#F78736]">${formValues.proposedDeposit ? Number(formValues.proposedDeposit).toLocaleString("es-AR") : "0"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#323232]">
                <span className="text-[10px] text-[#A8A8AA] font-bold uppercase tracking-wide">Fecha propuesta</span>
                <span className="text-sm font-bold">{formatDateDisplay(formValues.proposedDate)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#323232]">
                <span className="text-xs text-[#A8A8AA] font-semibold">Horario</span>
                <span className="text-xs font-bold text-right max-w-[120px]">{formValues.proposedTime || "-"}</span>
              </div>
              <div className="flex flex-col py-3 gap-2">
                <span className="text-[10px] text-[#A8A8AA] font-bold uppercase tracking-wide">Descripción de oferta</span>
                <p className="text-xs text-[#A8A8AA] leading-relaxed break-words">
                  {formValues.message ? `"${formValues.message}"` : "-"}
                </p>
              </div>
            </div>

            {/* Boton Enviar */}
            <button
              type="submit"
              form="offer-form"
              disabled={createOfferMutation.isPending || reqDetail?.hasOffer}
              className="mt-4 w-full rounded-[6px] bg-[#F78736] py-3 text-sm font-bold text-white hover:bg-[#e06d00] transition-colors disabled:opacity-50"
            >
              {createOfferMutation.isPending ? "Enviando..." : "Enviar oferta"}
            </button>
          </div>
        </div>
      </div>

      {/* Botones de acción inferiores */}
      <div className="mt-8 flex justify-between border-t border-[#323232] pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-[6px] border border-[#404040] bg-transparent px-4 py-2 text-xs font-medium text-white hover:bg-[#323232] transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Volver
        </button>
        <button
          onClick={() => navigate(-1)}
          className="rounded-[6px] border border-[#404040] bg-transparent px-6 py-2 text-xs font-medium text-white hover:bg-[#323232] transition-colors"
        >
          Cancelar
        </button>
      </div>

      <SuccessModal 
        isOpen={showSuccess} 
        onOffers={() => navigate(ROUTES.PROFESSIONAL_AGENDA)} 
        onHome={() => navigate(ROUTES.PROFESSIONAL_HOME)} 
      />
      
      <ErrorModal 
        isOpen={showError} 
        message={errorMessage}
        onRetry={() => {
          setShowError(false);
          document.getElementById('offer-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }} 
        onClose={() => setShowError(false)} 
      />
    </div>
  );
}
