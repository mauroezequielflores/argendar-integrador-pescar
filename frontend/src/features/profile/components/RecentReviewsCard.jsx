import React from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { ROUTES } from "../../../constants/routes";

/**
 * RecentReviewsCard — Tarjeta de opiniones recientes para el perfil profesional.
 * Si no hay reseñas, muestra el estado vacío con el CTA "Enviar ofertas".
 */
export default function RecentReviewsCard({ reviews = [] }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5 sm:p-6 w-full font-sans">
      <h2 className="text-base sm:text-lg font-semibold text-white">
        Opiniones recientes
      </h2>

      {reviews.length === 0 ? (
        /* Estado vacío */
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 sm:py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#323232]">
            <StarIcon className="h-6 w-6 text-[#A8A8AA]" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Aún no hay reseñas
          </h3>
          <p className="max-w-sm text-xs sm:text-sm text-[#A8A8AA] leading-relaxed">
            Las opiniones de los clientes aparecerán aquí cuando comiencen a calificar el servicio.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.PROFESSIONAL_MARKETPLACE || "/professional/marketplace")}
            className="mt-2 rounded-[6px] bg-[#F78736] px-6 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#e06d00] transition-colors cursor-pointer"
          >
            Enviar ofertas
          </button>
        </div>
      ) : (
        /* Listado de reseñas si existen */
        <div className="flex flex-col divide-y divide-[#323232]">
          {reviews.map((rev, index) => (
            <div key={rev.id || index} className="py-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  {rev.authorName || rev.clientName || "Cliente"}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIconSolid
                      key={s}
                      className={`h-4 w-4 ${
                        s <= (rev.rating || 5) ? "text-[#F78736]" : "text-[#323232]"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#A8A8AA]">{rev.comment}</p>
              {(rev.createdAt || rev.date) && (
                <span className="text-xs text-[#737373]">
                  {new Date(rev.createdAt || rev.date).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
