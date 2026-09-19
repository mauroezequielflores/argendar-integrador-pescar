import { useState } from "react";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

/**
 * RatingInput — Selector interactivo de puntaje por estrellas.
 *
 * @param {object} props
 * @param {number} props.value - Valor seleccionado actual (1 a 5, o 0 si ninguno)
 * @param {function} props.onChange - Callback al seleccionar un valor (rating) => void
 * @param {string} props.size - Tamaño de las estrellas ("sm", "md", "lg", "xl")
 * @param {boolean} props.readOnly - Modo solo lectura
 */
export default function RatingInput({
  value = 0,
  onChange,
  size = "lg",
  readOnly = false,
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-9 w-9 sm:h-10 sm:w-10",
    xl: "h-12 w-12",
  };

  const starSize = sizeClasses[size] || sizeClasses.lg;

  const currentActive = hoverValue > 0 ? hoverValue : value;

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3"
      onMouseLeave={() => !readOnly && setHoverValue(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= currentActive;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            aria-label={`${star} de 5 estrellas`}
            className={`transition-all duration-150 transform ${
              readOnly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 active:scale-95 focus:outline-none"
            }`}
          >
            {isFilled ? (
              <StarSolid className={`${starSize} text-[#F78736]`} />
            ) : (
              <StarOutline
                className={`${starSize} text-[#727272] transition-colors hover:text-[#A8A8AA]`}
                strokeWidth={1.5}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
