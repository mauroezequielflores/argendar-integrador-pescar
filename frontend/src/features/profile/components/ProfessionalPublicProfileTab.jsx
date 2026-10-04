import React from "react";
import RecentReviewsCard from "./RecentReviewsCard";
import ProfessionalInfoCard from "./ProfessionalInfoCard";
import AvailabilityCard from "./AvailabilityCard";
import RatingSummaryCard from "./RatingSummaryCard";

/**
 * ProfessionalPublicProfileTab — Pestaña de perfil público para el profesional.
 * 
 * Estructura de 2 columnas:
 * - Columna Izquierda: "Opiniones recientes" (reemplaza la antigua sección de "sobre mí")
 * - Columna Derecha (en la misma columna apilada):
 *   1. "Información Profesional"
 *   2. "Disponibilidad"
 *   3. "Resumen de Calificaciones"
 */
export default function ProfessionalPublicProfileTab({ profile = {} }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start w-full">
      {/* ── Columna Izquierda: Opiniones recientes ──────────────────── */}
      <RecentReviewsCard reviews={profile.recentReviews || []} />

      {/* ── Columna Derecha: Info + Disponibilidad + Calificaciones ─── */}
      <div className="flex flex-col gap-6 w-full">
        <ProfessionalInfoCard profile={profile} />

        {profile.availability !== null && (
          <AvailabilityCard availability={profile.availability} />
        )}

        <RatingSummaryCard
          rating={profile.ratingAvg ?? profile.rating ?? 0}
          reviewsCount={profile.reviewsCount || 0}
          breakdown={profile.ratingsBreakdown || {}}
        />
      </div>
    </div>
  );
}
