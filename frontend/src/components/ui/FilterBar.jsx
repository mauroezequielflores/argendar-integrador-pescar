import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * FilterBar — Barra para mostrar filtros activos con chips removibles.
 *
 * @param {Array} filters - Array de objetos { id, label }.
 * @param {function} onRemoveFilter - Callback al remover un filtro por su ID.
 * @param {string} label - Etiqueta de la barra (por defecto "Filtros |").
 * @param {string} className - Clases adicionales para el contenedor.
 */
export default function FilterBar({
  filters = [],
  onRemoveFilter,
  label = "Filtros |",
  className = "",
}) {
  if (filters.length === 0) return null;

  return (
    <div
      className={`flex items-center gap-3 rounded-[6px] bg-[#292929] px-4 py-2 ${className}`}
    >
      {label && <span className="text-xs text-[#A8A8AA] font-normal">{label}</span>}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center gap-1.5 rounded-[6px] bg-[#323232] px-2.5 py-1 text-xs text-white"
          >
            <span>{filter.label}</span>
            {onRemoveFilter && (
              <button
                type="button"
                onClick={() => onRemoveFilter(filter.id)}
                className="text-[#A8A8AA] hover:text-white transition-colors cursor-pointer"
                aria-label={`Remover filtro ${filter.label}`}
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
