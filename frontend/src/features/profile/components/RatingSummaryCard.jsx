import React from "react";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

/**
 * RatingSummaryCard — Muestra el resumen de calificaciones con desglose de estrellas.
 */
export default function RatingSummaryCard({
  rating = 0,
  reviewsCount = 0,
  breakdown = {},
}) {
  const normalizedBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, ...breakdown };
  const starsList = [5, 4, 3, 2, 1];

  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5 sm:p-6 w-full font-sans">
      <h2 className="text-base font-semibold text-white">
        Resumen de Calificaciones
      </h2>

      {/* Promedio y estrellas */}
      <div className="flex flex-col items-center gap-1.5 py-1">
        <span className="text-4xl sm:text-5xl font-bold text-white leading-none">
          {Number(rating).toFixed(1)}
        </span>
        <div className="flex gap-1 my-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIconSolid
              key={s}
              className={`h-5 w-5 ${
                s <= Math.round(rating) ? "text-[#F78736]" : "text-[#323232]"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-[#A8A8AA]">
          Basado en {reviewsCount} {reviewsCount === 1 ? "reseña" : "reseñas"}
        </p>
      </div>

      {/* Desglose de barras de 5 a 1 */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#323232]">
        {starsList.map((star) => {
          const count = normalizedBreakdown[star] || 0;
          const percentage = reviewsCount > 0 ? (count / reviewsCount) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3 text-xs text-[#A8A8AA]">
              <span className="w-2 font-medium">{star}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#323232]">
                <div
                  className="h-full rounded-full bg-[#F78736] transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
