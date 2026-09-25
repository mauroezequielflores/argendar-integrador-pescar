import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClockIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import Card from "../../../components/ui/Card";
import { useProfessionalReminderDetailQuery } from "../hooks/useProfessionalNotifications";

export default function ReminderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError } = useProfessionalReminderDetailQuery(id);

  const handleGoToAppointment = () => {
    if (data?.offerId) {
      navigate(`/professional/offers/${data.offerId}/details`);
    } else {
      navigate("/professional/agenda");
    }
  };

  const handleBack = () => {
    navigate("/professional/notifications");
  };

  // 1. Estado: Loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
        <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px] p-12 items-center justify-center">
          <p className="text-sm text-[#A8A8AA] animate-pulse">Cargando recordatorio de turno...</p>
        </Card>
      </div>
    );
  }

  // 2. Estado: Error
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
        <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px] p-8 items-center text-center gap-4">
          <h2 className="text-xl font-bold text-red-400">Error al cargar el turno</h2>
          <p className="text-sm text-[#A8A8AA]">
            No pudimos obtener la información de este recordatorio. Por favor, intentá nuevamente.
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
          <p className="text-sm text-[#A8A8AA]">No se encontraron detalles para este turno.</p>
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

  // 4. Estado: Success (datos reales cargados)
  return (
    <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
      {/* Contenedor Principal */}
      <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px]">
        {/* Contenido */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Cabecera */}
          <div className="flex flex-col gap-1 pb-6 border-b border-[#323232]">
            <p className="text-sm font-medium text-[#A8A8AA]">
              Hoy tenés un turno con {data.clientName}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-6 w-full max-w-3xl mx-auto">
            {/* Tarjeta de Resumen (Central) */}
            <div className="flex flex-col p-6 bg-[#292929] rounded-lg border border-[#323232]">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-[#A8A8AA]">
                    {data.clientAvatarUrl ? (
                      <img
                        src={data.clientAvatarUrl}
                        alt={data.clientName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#A8A8AA] text-white font-bold text-xl">
                        {data.clientInitials}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col mt-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{data.serviceName}</h2>
                      <div className="flex items-center rounded-md border border-[#A8A8AA] px-3 py-1 text-[11px] font-semibold text-[#A8A8AA] uppercase tracking-wider">
                        {data.status}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">
                      {data.clientName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#A8A8AA]">
                  <ClockIcon className="h-4 w-4" />
                  <span>{data.timeAgo}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm ml-20">
                  <CalendarDaysIcon className="h-5 w-5 text-[#F78736]" />
                  <span className="text-[#A8A8AA] font-medium">
                    {data.date}
                  </span>
                </div>

                <button
                  onClick={handleGoToAppointment}
                  className="flex items-center gap-2 rounded-md border border-[#A8A8AA] px-4 py-2 text-sm font-medium text-white hover:border-white transition-colors bg-transparent"
                >
                  Ver detalle <ArrowRightIcon className="h-4 w-4" />
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
