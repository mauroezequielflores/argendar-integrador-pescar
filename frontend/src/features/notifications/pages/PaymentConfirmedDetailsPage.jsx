import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClockIcon, ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import Card from "../../../components/ui/Card";
import { useProfessionalPaymentDetailQuery } from "../hooks/useProfessionalNotifications";

export default function PaymentConfirmedDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError } = useProfessionalPaymentDetailQuery(id);

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

  // 1. Estado Loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#202020] text-white p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F78736] border-t-transparent"></div>
          <p className="text-sm text-[#A8A8AA]">Cargando detalle del pago confirmado...</p>
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
            Ocurrió un error al cargar la información del pago.
          </p>
          <button
            onClick={handleBack}
            className="rounded-md bg-[#F78736] px-4 py-2 text-sm font-bold text-white hover:bg-[#e0752b] transition-colors cursor-pointer"
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
            No se encontró el comprobante de pago.
          </p>
          <button
            onClick={handleBack}
            className="rounded-md bg-[#323232] px-4 py-2 text-sm font-medium text-white hover:bg-[#444] transition-colors cursor-pointer"
          >
            Volver a notificaciones
          </button>
        </Card>
      </div>
    );
  }

  // 4. Estado Success
  return (
    <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
      {/* Contenedor Principal */}
      <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px]">
        
        {/* Contenido */}
        <div className="p-6 md:p-8 flex flex-col gap-6">

          {/* Cabecera */}
          <div className="flex flex-col gap-1 pb-6 border-b border-[#323232]">
            <p className="text-sm font-medium text-[#A8A8AA]">
              Se acreditó correctamente el pago de su próximo turno.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-6 w-full max-w-3xl mx-auto">
            
            {/* Tarjeta del Profesional / Turno (Central) */}
            <div className="flex flex-col p-6 bg-[#292929] rounded-lg border border-[#323232]">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-[#A8A8AA]">
                    <div className="flex h-full w-full items-center justify-center bg-[#A8A8AA] text-white font-bold text-xl">
                      {data.professionalInitials}
                    </div>
                  </div>
                  <div className="flex flex-col mt-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{data.serviceName}</h2>
                      <div className="flex items-center rounded-md border border-[#A8A8AA] px-3 py-1 text-[11px] font-semibold text-[#A8A8AA] uppercase tracking-wider">
                        {data.status}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">
                      {data.professionalName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#A8A8AA]">
                  <ClockIcon className="h-4 w-4" />
                  <span>{data.timeAgo}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm ml-0 sm:ml-20">
                  <CalendarDaysIcon className="h-5 w-5 text-[#F78736]" />
                  <span className="text-[#A8A8AA] font-medium">
                    {data.date} {data.time}
                  </span>
                </div>
                
                <button
                  onClick={handleGoToDetails}
                  className="flex items-center gap-2 rounded-md border border-[#A8A8AA] px-4 py-2 text-sm font-medium text-white hover:border-white transition-colors bg-transparent cursor-pointer"
                >
                  Ver detalle <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tarjeta de Detalles de Pago (Tabla) */}
            <div className="flex flex-col bg-[#292929] rounded-lg border border-[#323232] overflow-hidden">
              <div className="flex items-center justify-between" style={{ padding: '28px 24px' }}>
                <span className="text-sm font-bold text-[#A8A8AA] uppercase tracking-wider">ESTADO</span>
                <span className="rounded-md bg-white px-3 py-1 text-xs font-bold text-[#202020] uppercase tracking-wide">
                  {data.paymentStatus}
                </span>
              </div>
              
              <div className="border-t border-[#323232]"></div>

              <div className="flex flex-col gap-5" style={{ padding: '28px 24px' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#A8A8AA]">Nº de Operación</span>
                  <span className="text-sm font-medium text-white">{data.operationId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#A8A8AA]">Método</span>
                  <span className="text-sm font-medium text-white">{data.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#A8A8AA]">Fecha</span>
                  <span className="text-sm font-medium text-white">{data.paymentDate}</span>
                </div>
              </div>

              <div className="border-t border-[#323232]"></div>

              <div className="flex items-center justify-between" style={{ padding: '28px 24px' }}>
                <span className="text-base font-bold text-[#A8A8AA]">Monto Pagado</span>
                <span className="text-2xl font-bold text-white">{data.amount}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer (Botones de acción integrados a la card) */}
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
