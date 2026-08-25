import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * FilterBar — Barra para mostrar filtros activos.
 */
export default function FilterBar({ filters = [], onRemoveFilter, className = "" }) {
  if (filters.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 rounded-[6px] bg-[#292929] px-4 py-2.5 ${className}`}>
      <span className="text-sm text-[#A8A8AA]">Filtros |</span>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center gap-1 rounded-full bg-[#3f3f3f] px-3 py-1 text-xs text-white"
          >
            <span>{filter.label}</span>
            <button
              onClick={() => onRemoveFilter(filter.id)}
              className="text-[#A8A8AA] hover:text-white transition-colors"
              aria-label={`Remover filtro ${filter.label}`}
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
