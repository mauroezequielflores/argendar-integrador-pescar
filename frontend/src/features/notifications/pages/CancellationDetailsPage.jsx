import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClockIcon, ArrowRightIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import Card from "../../../components/ui/Card";
import { useProfessionalCancellationDetailQuery } from "../hooks/useProfessionalNotifications";

export default function CancellationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError, refetch } = useProfessionalCancellationDetailQuery(id);

  const handleBack = () => {
    navigate("/professional/notifications");
  };

  const handleGoToDetails = () => {
    if (data?.offerId) {
      navigate(`/professional/offers/${data.offerId}/details`);
    } else {
      navigate("/professional/notifications");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
      {/* Contenedor Principal */}
      <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px]">
        
        {/* 1. Estado Loading */}
        {isLoading && (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F78736] border-t-transparent"></div>
            <p className="text-sm text-[#A8A8AA]">Cargando detalle del turno cancelado...</p>
          </div>
        )}

        {/* 2. Estado Error */}
        {!isLoading && isError && (
          <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-base text-red-400">Ocurrió un error al cargar el detalle del turno cancelado.</p>
            <div className="flex gap-4">
              <button
                onClick={() => refetch()}
                className="rounded-md border border-[#F78736] px-4 py-2 text-sm text-[#F78736] hover:bg-[#F78736] hover:text-white transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={handleBack}
                className="rounded-md border border-[#323232] px-4 py-2 text-sm text-[#A8A8AA] hover:text-white transition-colors"
              >
                Volver a Notificaciones
              </button>
            </div>
          </div>
        )}

        {/* 3. Estado Empty */}
        {!isLoading && !isError && !data && (
          <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-base text-[#A8A8AA]">No se encontró la información de este turno cancelado.</p>
            <button
              onClick={handleBack}
              className="rounded-md border border-[#323232] px-4 py-2 text-sm text-white hover:border-white transition-colors"
            >
              Volver a Notificaciones
            </button>
          </div>
        )}

        {/* 4. Estado Success */}
        {!isLoading && !isError && data && (
          <>
            {/* Contenido */}
            <div className="p-6 md:p-8 flex flex-col gap-6">

              {/* Cabecera Principal */}
              <div className="flex flex-col gap-2 pb-6 border-b border-[#323232]">
                <h1 className="text-2xl font-bold text-white">Turno cancelado</h1>
                <p className="text-sm font-medium text-[#A8A8AA]">
                  El cliente canceló tu turno programado para el {data.date} a las {data.time}.
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-6 w-full max-w-3xl mx-auto">
                
                <h2 className="text-lg font-bold text-white mb-2">
                  {data.clientName} ha cancelado tu turno.
                </h2>

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
                        {data.date} {data.time}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleGoToDetails}
                      className="flex items-center gap-2 rounded-md border border-[#A8A8AA] px-4 py-2 text-sm font-medium text-white hover:border-white transition-colors bg-transparent"
                    >
                      Ver detalle <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white mt-4 mb-1">
                  Motivo de Cancelación.
                </h2>

                {/* Tarjeta de Motivo */}
                <div className="p-6 bg-[#292929] rounded-lg border border-[#323232]">
                  <p className="text-sm font-medium text-[#A8A8AA]">
                    {data.reason}
                  </p>
                </div>

                {/* Tarjeta de Información/Soporte */}
                <div className="p-5 bg-[#292929] rounded-lg border border-[#323232] flex items-center gap-4 mt-2">
                  <div className="flex-shrink-0">
                    <InformationCircleIcon className="h-6 w-6 text-[#A8A8AA]" />
                  </div>
                  <p className="text-sm font-medium text-[#A8A8AA]">
                    Si sentis que hubo un error, no dudes en comunicarte con soporte en{" "}
                    <a href="mailto:argendarsoporte@gmail.com" className="underline hover:text-white">
                      argendarsoporte@gmail.com
                    </a>
                  </p>
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
          </>
        )}
      </Card>
    </div>
  );
}
