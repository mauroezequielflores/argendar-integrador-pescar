import React from "react";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

/**
 * ProfessionalInfoCard — Muestra la información profesional/personal del perfil.
 * (Ubicación base, radio de cobertura, miembro desde y certificaciones).
 */
export default function ProfessionalInfoCard({ profile = {} }) {
  const baseLocation =
    profile.baseLocation ||
    (profile.location && profile.location !== "-" ? profile.location : null) ||
    "No especificada";

  const coverage = profile.coverageRadiusKm
    ? `${profile.coverageRadiusKm} km`
    : profile.coverageRadius
    ? `${profile.coverageRadius} km`
    : "No especificado";

  const memberSinceFormatted = profile.memberSince
    ? typeof profile.memberSince === "string" && profile.memberSince.includes("T")
      ? new Date(profile.memberSince).toLocaleDateString()
      : profile.memberSince
    : "-";

  const certifications = profile.certifications || [];

  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5 sm:p-6 w-full font-sans">
      <h2 className="text-base font-semibold text-white">
        Información Profesional
      </h2>

      <div className="flex flex-col gap-3 text-xs sm:text-sm">
        {/* Ubicación base */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[#A8A8AA]">Ubicación base</span>
          <span className="text-white text-right">{baseLocation}</span>
        </div>

        <div className="h-px bg-[#323232]" />

        {/* Radio de cobertura */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[#A8A8AA]">Radio de cobertura</span>
          <span className="text-white text-right">{coverage}</span>
        </div>

        <div className="h-px bg-[#323232]" />

        {/* Miembro desde */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[#A8A8AA]">Miembro desde</span>
          <span className="font-medium text-white text-right">
            {memberSinceFormatted}
          </span>
        </div>
      </div>

      {/* Certificaciones */}
      {certifications.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-[#323232]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#A8A8AA]">
            Certificaciones
          </p>
          <div className="flex flex-col gap-1.5">
            {certifications.map((cert, idx) => (
              <div key={cert.name || idx} className="flex items-center gap-2">
                <AcademicCapIcon className="h-4 w-4 text-[#A8A8AA] shrink-0" />
                <span className="text-xs sm:text-sm text-white">{cert.name || cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
