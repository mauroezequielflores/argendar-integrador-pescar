import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClockIcon, ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import Card from "../../../components/ui/Card";

// Mock data (ideally fetched by id)
const mockData = {
  professionalName: "Ricardo Gómez",
  professionalInitials: "RG",
  serviceName: "Instalación eléctrica",
  status: "PROGRAMADO",
  date: "28/07/2026",
  time: "15:30 hs",
  timeAgo: "hace 2 días",
  paymentStatus: "CONFIRMADO",
  operationId: "#MP-982341",
  paymentMethod: "Mercado Pago",
  paymentDate: "12 Mayo, 2026",
  amount: "$3.500,00"
};

export default function PaymentConfirmedDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleBack = () => {
    navigate("/professional/notifications");
  };

  const handleGoToDetails = () => {
    navigate(`/professional/offers/3/details`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#202020] text-white p-4 md:p-6 lg:p-8">
      {/* Contenedor Principal */}
      <Card className="flex flex-col mx-auto w-full max-w-4xl border border-[#323232] bg-[#202020] overflow-hidden rounded-[16px]">
        
        {/* Contenido */}
        <div className="p-6 md:p-8 flex flex-col gap-6">

          {/* Cabecera */}
          <div className="flex flex-col gap-1 pb-6 border-b border-[#323232]">
            <p className="text-sm font-medium text-[#A8A8AA]">
              Se acredito correctamente el pago de su proximo turno.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-6 w-full max-w-3xl mx-auto">
            
            {/* Tarjeta del Profesional / Turno (Central) */}
            <div className="flex flex-col p-6 bg-[#292929] rounded-lg border border-[#323232]">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-[#A8A8AA]">
                    <div className="flex h-full w-full items-center justify-center bg-[#A8A8AA] text-white font-bold text-xl">
                      {mockData.professionalInitials}
                    </div>
                  </div>
                  <div className="flex flex-col mt-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">{mockData.serviceName}</h2>
                      <div className="flex items-center rounded-md border border-[#A8A8AA] px-3 py-1 text-[11px] font-semibold text-[#A8A8AA] uppercase tracking-wider">
                        {mockData.status}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white mt-1">
                      {mockData.professionalName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#A8A8AA]">
                  <ClockIcon className="h-4 w-4" />
                  <span>{mockData.timeAgo}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm ml-20">
                  <CalendarDaysIcon className="h-5 w-5 text-[#F78736]" />
                  <span className="text-[#A8A8AA] font-medium">
                    {mockData.date} {mockData.time}
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

            {/* Tarjeta de Detalles de Pago (Tabla) */}
            <div className="flex flex-col bg-[#292929] rounded-lg border border-[#323232] overflow-hidden">
              <div className="flex items-center justify-between" style={{ padding: '28px 24px' }}>
                <span className="text-sm font-bold text-[#A8A8AA] uppercase tracking-wider">ESTADO</span>
                <span className="rounded-md bg-white px-3 py-1 text-xs font-bold text-[#202020] uppercase tracking-wide">
                  {mockData.paymentStatus}
                </span>
              </div>
              
              <div className="border-t border-[#323232]"></div>

              <div className="flex flex-col gap-5" style={{ padding: '28px 24px' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#A8A8AA]">Nº de Operación</span>
                  <span className="text-sm font-medium text-white">{mockData.operationId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#A8A8AA]">Método</span>
                  <span className="text-sm font-medium text-white">{mockData.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#A8A8AA]">Fecha</span>
                  <span className="text-sm font-medium text-white">{mockData.paymentDate}</span>
                </div>
              </div>

              <div className="border-t border-[#323232]"></div>

              <div className="flex items-center justify-between" style={{ padding: '28px 24px' }}>
                <span className="text-base font-bold text-[#A8A8AA]">Monto Pagado</span>
                <span className="text-2xl font-bold text-white">{mockData.amount}</span>
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
