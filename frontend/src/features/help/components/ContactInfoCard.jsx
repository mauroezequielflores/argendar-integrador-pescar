import React from "react";
import { CONTACT_INFO } from "../data/helpData";

export default function ContactInfoCard() {
  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
      <h3 className="text-sm sm:text-base font-semibold text-white">
        Información de Contacto
      </h3>

      <div className="flex flex-col gap-3">
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#A8A8AA] leading-tight">
            CORREO DE SOPORTE
          </span>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="text-xs font-medium text-white hover:text-[#F78736] transition-colors"
          >
            {CONTACT_INFO.email}
          </a>
        </div>

        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#A8A8AA] leading-tight">
            HORARIO DE ATENCIÓN
          </span>
          <span className="text-xs font-medium text-white">
            {CONTACT_INFO.schedule}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#A8A8AA] leading-tight">
            TIEMPO PROMEDIO DE RESPUESTA
          </span>
          <span className="text-xs font-medium text-white">
            {CONTACT_INFO.responseTime}
          </span>
        </div>
      </div>

      <div className="border-t border-[#323232] pt-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
        <span className="text-xs font-medium text-white">
          Estado del servicio: {CONTACT_INFO.status}
        </span>
      </div>
    </div>
  );
}
