import React from "react";
import {
  MapPinIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

/**
 * ProfessionalCard — Tarjeta de presentación de un profesional en Marketplace.
 */
export default function ProfessionalCard({ professional, onContact, onViewProfile }) {
  if (!professional) return null;

  return (
    <div className="flex flex-col gap-3 rounded-[6px] border border-[#323232] bg-[#292929] p-4 transition-all duration-200 hover:border-[#F78736]/50">
      {/* ── Encabezado ────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#323232] text-white">
            {professional.nombre ? (
              <span className="text-xs font-bold uppercase tracking-wider">
                {professional.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            ) : (
              <UserIcon className="h-5 w-5 text-[#A8A8AA]" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{professional.nombre}</h3>
            <p className="text-xs text-[#A8A8AA]">{professional.profesion}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {professional.categoria && (
            <span className="shrink-0 rounded-full bg-[#323232] px-2.5 py-1 text-xs font-medium text-[#F78736]">
              {professional.categoria}
            </span>
          )}
        </div>
      </div>

      {/* ── Descripción ───────────────────────────────────────── */}
      <p className="text-xs text-[#A8A8AA] leading-relaxed">
        {professional.descripcion}
      </p>

      {/* ── Calificación, Ubicación y Detalles ─────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#323232]/60 pt-3 text-xs text-[#A8A8AA]">
        <div className="flex items-center gap-4">
          {professional.calificacion && (
            <div className="flex items-center gap-1 text-[#FFFFFF]">
              <StarIconSolid className="h-4 w-4 text-[#F78736]" />
              <span className="font-semibold">{professional.calificacion}</span>
              {professional.resenasCount && (
                <span className="text-[#A8A8AA]">({professional.resenasCount})</span>
              )}
            </div>
          )}

          {professional.ubicacion && (
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4 text-[#A8A8AA]" />
              {professional.ubicacion}
              {professional.distancia && (
                <span className="text-[#A8A8AA]"> • {professional.distancia}</span>
              )}
            </span>
          )}
        </div>

        {professional.precioBase && (
          <span className="font-medium text-white">
            {professional.precioBase}
          </span>
        )}
      </div>
    </div>
  );
}
