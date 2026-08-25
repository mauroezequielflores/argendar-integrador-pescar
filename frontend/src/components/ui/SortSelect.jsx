import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

/**
 * SortSelect — Control compacto para selector de ordenamiento en barras de filtros.
 *
 * @param {string} label - Etiqueta anterior (ej. "Ordenar por:").
 * @param {string} value - Valor seleccionado.
 * @param {function} onChange - Callback al cambiar valor.
 * @param {Array} options - Array de objetos { value, label }.
 * @param {string} className - Clases adicionales.
 */
export default function SortSelect({
  label = "Ordenar por:",
  value,
  onChange,
  options = [],
  className = "",
}) {
  return (
    <div className={`flex items-center gap-2 text-xs sm:text-sm text-[#A8A8AA] ${className}`}>
      {label && <span className="shrink-0">{label}</span>}
      <div className="relative inline-flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label || "Ordenar por"}
          className="appearance-none rounded-[6px] border border-[#323232] bg-[#292929] py-1 pl-3 pr-7 text-xs text-white transition-colors hover:border-[#555] focus:border-[#F78736] focus:outline-none cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#292929] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2 flex items-center text-[#A8A8AA]">
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
