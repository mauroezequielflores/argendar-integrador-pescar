import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StarIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { CalendarIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Card from "../../../components/ui/Card";
import { useProfessionalReviewDetailQuery } from "../hooks/useProfessionalNotifications";

export default function ReviewDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError } = useProfessionalReviewDetailQuery(id);

  const handleBack = () => {
    navigate("/professional/notifications");
  };

  const handleGoToDetails = () => {
    if (data?.offerId) {
      navigate(`/professional/offers/${data.offerId}/details`);
    } else {
      navigate("/professional/agenda");
    }
  };

  const handleContactSupport = () => {
    navigate("/professional/help");
  };

  // 1. Estado Loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#202020] text-white p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F78736] border-t-transparent"></div>
          <p className="text-sm text-[#A8A8AA]">Cargando detalle de la valoración...</p>
        </div>
      </div>
    );
  }

  // 2. Estado Error
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#202020] text-white p-4">
        <Card className="flex flex-col max-w-md w-full p-6 text-center border border-[#323232] bg-[#202020] rounded-[16px] gap-4">
          <p className="text-base text-red-400 font-medium">
            Ocurrió un error al cargar la información de la valoración.
          </p>
          <button
            onClick={handleBack}
            className="rounded-md bg-[#F78736] px-4 py-2 text-sm font-bold text-white hover:bg-[#e0752b] transition-colors"
          >
            Volver a notificaciones
          </button>
        </Card>
      </div>
    );
  }

  // 3. Estado Empty
  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#202020] text-white p-4">
        <Card className="flex flex-col max-w-md w-full p-6 text-center border border-[#323232] bg-[#202020] rounded-[16px] gap-4">
          <p className="text-base text-[#A8A8AA]">
            No se encontró la información de la reseña.
          </p>
          <button
            onClick={handleBack}
            className="rounded-md bg-[#323232] px-4 py-2 text-sm font-medium text-white hover:bg-[#444] transition-colors"
          >
            Volver a notificaciones
          </button>
        </Card>
      </div>
    );
  }

  // 4. Estado Success
  const ratingValue = Number(data.rating) || 5;

  return (
    <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
      {/* Contenedor Principal */}
      <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px]">
        
        {/* Contenido */}
        <div className="p-6 md:p-8 flex flex-col gap-6">

          {/* Cabecera Principal */}
          <div className="flex flex-col gap-2 pb-6 border-b border-[#323232]">
            <h1 className="text-2xl font-bold text-white">Un cliente calificó tu servicio</h1>
            <p className="text-sm font-medium text-[#A8A8AA]">
              Recibiste una nueva valoración sobre un turno finalizado.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-6 w-full max-w-3xl mx-auto">
            
            {/* Tarjeta de Reseña */}
            <div className="flex flex-col p-6 bg-[#292929] rounded-lg border border-[#323232] gap-6">
              
              {/* Parte Superior: Avatar y Puntaje */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full bg-white flex items-center justify-center font-bold text-[#202020] text-lg">
                    {data.clientAvatarUrl ? (
                      <img
                        src={data.clientAvatarUrl}
                        alt={data.clientName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      data.clientInitials || data.clientName?.slice(0, 2)?.toUpperCase() || "CL"
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-white leading-tight">{data.clientName}</h2>
                    <span className="text-[11px] font-semibold text-[#A8A8AA] uppercase tracking-wider mt-1">CLIENTE VERIFICADO</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${i < ratingValue ? 'text-[#F78736]' : 'text-[#A8A8AA]'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-white mt-2">
                    puntaje: {ratingValue} de 5 estrellas
                  </span>
                </div>
              </div>

              {/* Centro: Título y Caja de Comentario */}
              <div className="flex flex-col gap-4">
                <p className="text-[15px] font-bold text-white">
                  Valoración recibida para turno "{data.appointmentTitle}"
                </p>
                {data.reviewText ? (
                  <div className="p-6 rounded-lg border border-[#323232]">
                    <p className="text-[15px] italic text-[#A8A8AA]">
                      "{data.reviewText}"
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-[#323232] bg-[#242424]">
                    <p className="text-sm italic text-[#777]">
                      El cliente no dejó comentarios adicionales.
                    </p>
                  </div>
                )}

                {/* Etiquetas / Tags seleccionadas si existen */}
                {Array.isArray(data.tags) && data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {data.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-[#353535] text-[#F78736] border border-[#484848]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Inferior: Fecha y Botón de Navegación */}
              <div className="flex items-center justify-between mt-2 flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm text-[#A8A8AA]">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Calificado el {data.date} a las {data.time}</span>
                </div>
                
                <button
                  onClick={handleGoToDetails}
                  className="flex items-center gap-2 rounded-md border border-[#A8A8AA] px-4 py-2 text-sm font-medium text-white hover:border-white transition-colors bg-transparent cursor-pointer"
                >
                  Ver detalle <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tarjeta de Apelación y Soporte */}
            <div className="flex flex-col p-6 bg-[#292929] rounded-lg border border-[#323232] mt-2 gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-[#A8A8AA]" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-white">¿Considerás que esta valoración incumple las políticas?</h3>
                  <p className="text-sm font-medium text-[#A8A8AA] leading-relaxed">
                    Si considerás que la valoración contiene contenido ofensivo, falso, spam o malicioso, podés solicitar una revisión al equipo de soporte de Argendar.
                  </p>
                </div>
              </div>
              
              <div className="ml-10 mt-2">
                <button
                  onClick={handleContactSupport}
                  className="rounded-md bg-white px-5 py-2.5 text-sm font-bold text-[#202020] hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Contactar a soporte
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 flex items-center justify-between border-t border-[#323232]">
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#A8A8AA] hover:text-[#FFFFFF] hover:bg-[#323232] transition-colors bg-transparent border border-transparent cursor-pointer"
          >
            <span className="mr-1 text-lg">&larr;</span> Volver
          </button>
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#A8A8AA] hover:text-[#FFFFFF] hover:border-[#F78736] transition-colors bg-transparent border border-[#323232] cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </Card>
    </div>
  );
}
