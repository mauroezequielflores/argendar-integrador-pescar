import React from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

function formatFecha(fechaISO) {
  if (!fechaISO) return "";
  const parts = fechaISO.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return fechaISO;
}

/**
 * SolicitudCard — Tarjeta de solicitud publicada en Marketplace.
 */
export default function SolicitudCard({ solicitud }) {
  if (!solicitud) return null;

  return (
    <div className="flex flex-col gap-3 rounded-[6px] border border-[#323232] bg-[#292929] p-4 transition-all duration-200 hover:border-[#F78736]/50">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">{solicitud.titulo}</h3>
          {solicitud.cliente && (
            <p className="mt-0.5 text-xs text-[#A8A8AA]">{solicitud.cliente}</p>
          )}
        </div>
        {solicitud.categoria && (
          <span className="shrink-0 rounded-full bg-[#323232] px-2.5 py-1 text-xs font-medium text-[#F78736]">
            {solicitud.categoria}
          </span>
        )}
      </div>

      <p className="text-xs text-[#A8A8AA] leading-relaxed">
        {solicitud.descripcion}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-xs text-[#A8A8AA] border-t border-[#323232]/60 pt-3">
        {solicitud.ubicacion && (
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4 text-[#A8A8AA]" />
            {solicitud.ubicacion}
          </span>
        )}
        {solicitud.fecha && (
          <span>{formatFecha(solicitud.fecha)}</span>
        )}
      </div>
    </div>
  );
}
