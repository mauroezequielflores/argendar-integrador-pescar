import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckIcon, CalendarDaysIcon, StarIcon } from "@heroicons/react/24/solid";
import Card from "../../../components/ui/Card";
import { useProfessionalOfferDetailQuery } from "../hooks/useProfessionalNotifications";

export default function OfferDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError } = useProfessionalOfferDetailQuery(id);

  const handleGoToAppointment = () => {
    navigate(`/professional/appointments/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 1. Estado: Loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
        <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px] p-12 items-center justify-center">
          <p className="text-sm text-[#A8A8AA] animate-pulse">Cargando detalles de la oferta...</p>
        </Card>
      </div>
    );
  }

  // 2. Estado: Error
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
        <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px] p-8 items-center text-center gap-4">
          <h2 className="text-xl font-bold text-red-400">Error al cargar la oferta</h2>
          <p className="text-sm text-[#A8A8AA]">
            No pudimos obtener la información de esta oferta. Por favor, intentá nuevamente.
          </p>
          <button
            onClick={handleBack}
            className="mt-2 rounded-md bg-[#323232] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a3a3a] transition-colors"
          >
            &larr; Volver
          </button>
        </Card>
      </div>
    );
  }

  // 3. Estado: Empty (sin datos)
  if (!data) {
    return (
      <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
        <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px] p-8 items-center text-center gap-4">
          <p className="text-sm text-[#A8A8AA]">No se encontraron detalles para esta oferta.</p>
          <button
            onClick={handleBack}
            className="mt-2 rounded-md bg-[#323232] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a3a3a] transition-colors"
          >
            &larr; Volver
          </button>
        </Card>
      </div>
    );
  }

  // 4. Estado: Success (datos cargados)
  return (
    <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
      {/* Contenedor Principal */}
      <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px]">
        {/* Contenido */}
        <div className="p-6 md:p-8 flex flex-col">
          {/* Cabecera */}
          <div className="flex flex-col gap-1 pb-6 border-b border-[#323232]">
            <h1 className="text-2xl font-bold text-white">¡Tu oferta fue aceptada!</h1>
            <p className="text-sm font-medium text-[#A8A8AA]">
              Un cliente aceptó tu oferta.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-6 w-full max-w-3xl mx-auto">
            {/* Tarjeta de Encabezado (Información del Cliente y Estado) */}
            <div className="flex items-center justify-between rounded-lg border border-[#323232] bg-[#292929] p-5">
              <div className="flex items-center gap-4">
                {data.clientAvatarUrl ? (
                  <img
                    src={data.clientAvatarUrl}
                    alt={data.clientName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold text-[#202020]">
                    {data.clientInitials}
                  </div>
                )}
                <h2 className="text-lg font-bold text-white">{data.clientName}</h2>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-[#A8A8AA] px-3 py-1 text-xs font-semibold text-white">
                <CheckIcon className="h-4 w-4 text-white" />
                OFERTA ACEPTADA
              </div>
            </div>

            {/* Subtítulo intermedio */}
            <h2 className="text-base font-bold text-white mt-2">
              Se aceptó la oferta a la solicitud "{data.requestTitle || 'Solicitud de servicio'}"
            </h2>

            {/* Tarjeta de Detalles de la Propuesta */}
            <div className="flex flex-col rounded-lg border border-[#323232] bg-[#292929] p-5">
              {/* Cabecera: Info Profesional y Precios */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full bg-[#A8A8AA]">
                    {data.profAvatarUrl ? (
                      <img
                        src={data.profAvatarUrl}
                        alt={data.profName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#A8A8AA] text-white font-bold text-lg">
                        {data.profName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{data.profName}</h3>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= Math.round(data.rating) ? "text-white" : "text-[#727272]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] font-bold tracking-widest text-[#A8A8AA] uppercase mt-0.5">
                      {data.profCategory}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-white">{data.price}</span>
                  <span className="text-xs text-[#A8A8AA] mt-1">
                    Seña requerida: {data.deposit}
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-[#323232]"></div>

              {/* Cuerpo (Mensaje) */}
              <p className="text-sm leading-relaxed text-[#A8A8AA]">
                {data.message}
              </p>

              <div className="my-5 border-t border-[#323232]"></div>

              {/* Pie de tarjeta (Disponibilidad y Acción) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDaysIcon className="h-5 w-5 text-[#F78736]" />
                  <span className="text-[#A8A8AA]">Disponibilidad:</span>
                  <span className="font-bold text-white">
                    {data.availability}
                  </span>
                </div>
                <button
                  onClick={handleGoToAppointment}
                  className="rounded-md bg-[#F78736] px-4 py-2 text-sm font-medium text-white hover:bg-[#e06d00] transition-colors"
                >
                  ir al turno
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Botones de acción integrados a la card) */}
        <div className="p-6 md:p-8 flex items-center justify-between border-t border-[#323232]">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#A8A8AA] hover:text-[#FFFFFF] hover:bg-[#323232] transition-colors bg-transparent border border-transparent"
          >
            <span className="mr-1 text-lg">&larr;</span> Volver
          </button>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#A8A8AA] hover:text-[#FFFFFF] hover:border-[#F78736] transition-colors bg-transparent border border-[#323232]"
          >
            Cancelar
          </button>
        </div>
      </Card>
    </div>
  );
}
