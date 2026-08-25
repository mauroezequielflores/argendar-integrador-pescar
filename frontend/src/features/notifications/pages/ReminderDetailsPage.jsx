import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClockIcon, ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

// mock data local (idealmente se traería por id)
const mockData = {
  clientName: "Ricardo Gómez",
  clientInitials: "RG", // The story says: Avatar: Fotografía o imagen...
  serviceName: "Instalación eléctrica",
  status: "PENDIENTE",
  date: "28/07/2026 15:30 hs",
  timeAgo: "hace 2 días",
};

export default function ReminderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleGoToAppointment = () => {
    navigate(`/professional/offers/3/details`);
  };

  const handleBack = () => {
    navigate("/professional/notifications");
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
              Hoy tenes un turno con {mockData.clientName}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-6 w-full max-w-3xl mx-auto">
            {/* Tarjeta de Resumen (Central) */}
            <div className="flex flex-col p-6 bg-[#292929] rounded-lg border border-[#323232]">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-[#A8A8AA]">
                    <div className="flex h-full w-full items-center justify-center bg-[#A8A8AA] text-white font-bold text-xl">
                      {mockData.clientInitials}
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
                      {mockData.clientName}
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
                    {mockData.date}
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
