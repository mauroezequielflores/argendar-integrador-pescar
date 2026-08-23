import { StarIcon } from "@heroicons/react/24/solid";
import ProgressBar from "./ProgressBar";

/**
 * RatingSummary — Resumen visual de calificaciones.
 *
 * Muestra el promedio, estrellas visuales y el desglose en barras.
 *
 * @param {number} average - Promedio de calificación (ej: 4.5).
 * @param {number} totalReviews - Cantidad total de opiniones.
 * @param {Object} breakdown - Objeto con la cantidad de votos por estrella {5: 10, 4: 2, ...}.
 */
export default function RatingSummary({ average = 0, totalReviews = 0, breakdown = {} }) {
  // Asegurar un desglose por defecto
  const defaultBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, ...breakdown };
  
  // Arreglo del 5 al 1 para renderizar las filas
  const starsList = [5, 4, 3, 2, 1];

  return (
    <div className="flex flex-col gap-6">
      {/* Sección Superior: Promedio y Estrellas */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl font-bold text-white">
          {average.toFixed(1)}
        </span>
        
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(average) ? "text-[#3a3a3a]" : "text-[#2e2e2e]"
              }`}
            />
          ))}
        </div>
        
        <span className="text-xs text-[#A8A8AA]">
          Basado en {totalReviews} opiniones
        </span>
      </div>

      {/* Desglose de barras */}
      <div className="flex flex-col gap-2">
        {starsList.map((star) => {
          const count = defaultBreakdown[star] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3">
              <span className="w-2 text-xs font-medium text-[#A8A8AA]">
                {star}
              </span>
              <ProgressBar progress={percentage} className="flex-1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
