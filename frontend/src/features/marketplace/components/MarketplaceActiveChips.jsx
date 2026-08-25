import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * MarketplaceActiveChips — Barra de etiquetas ("chips") de filtros activos.
 * Permite remover individualmente cualquier filtro aplicado.
 */
export default function MarketplaceActiveChips({
  sortLabel = "Más nuevo",
  appliedSearch = "",
  appliedCategories = [],
  onRemoveSort,
  onRemoveSearch,
  onRemoveCategory,
  className = "",
}) {
  const hasFilters = Boolean(
    sortLabel || (appliedSearch && appliedSearch.trim()) || appliedCategories.length > 0
  );

  if (!hasFilters) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-[6px] bg-[#292929] px-3 py-2 ${className}`}>
      <span className="text-xs text-[#A8A8AA]">Filtros</span>
      <span className="text-xs text-[#A8A8AA]">|</span>

      {/* Chip de Ordenamiento */}
      {sortLabel && (
        <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#323232] px-2 py-1 text-xs text-white">
          <span>{sortLabel}</span>
          {onRemoveSort && (
            <button
              type="button"
              onClick={onRemoveSort}
              className="text-[#A8A8AA] transition-colors hover:text-white cursor-pointer"
              aria-label={`Remover filtro ${sortLabel}`}
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          )}
        </span>
      )}

      {/* Chip de Búsqueda por texto */}
      {appliedSearch && appliedSearch.trim() !== "" && (
        <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#323232] px-2 py-1 text-xs text-white">
          <span className="truncate max-w-[150px]">"{appliedSearch}"</span>
          {onRemoveSearch && (
            <button
              type="button"
              onClick={onRemoveSearch}
              className="text-[#A8A8AA] transition-colors hover:text-white cursor-pointer"
              aria-label="Remover filtro de búsqueda"
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          )}
        </span>
      )}

      {/* Chips de Categorías */}
      {appliedCategories.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#323232] px-2 py-1 text-xs text-white"
        >
          <span>{cat}</span>
          {onRemoveCategory && (
            <button
              type="button"
              onClick={() => onRemoveCategory(cat)}
              className="text-[#A8A8AA] transition-colors hover:text-white cursor-pointer"
              aria-label={`Remover filtro ${cat}`}
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
