import React from "react";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  MapIcon,
} from "@heroicons/react/24/outline";

/**
 * MarketplaceFilterSidebar — Panel lateral de filtros para el Marketplace.
 * Reutilizable tanto para la pestaña de Profesionales como de Solicitudes publicadas.
 */
export default function MarketplaceFilterSidebar({
  tab = "profesionales",
  searchText = "",
  onSearchChange,
  categories = [],
  selectedCategories = [],
  onCategoryToggle,
  location = "Av. Corrientes 1234, CABA",
  onApply,
  onClear,
  onOpenMap,
  className = "",
}) {
  const isProfesionales = tab === "profesionales";

  return (
    <aside className={`flex w-64 lg:w-72 shrink-0 flex-col gap-4 ${className}`}>
      {/* ── 1. Buscar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 rounded-[6px] bg-[#292929] p-4">
        <p className="text-xs font-semibold text-white">Buscar</p>
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A8AA]" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isProfesionales
                ? "Buscar por nombre o apellido"
                : "Ej. Reparación de caños"
            }
            className="w-full rounded-[6px] border border-[#323232] bg-[#202020] py-2 pl-9 pr-3 text-xs text-white placeholder-[#A8A8AA] transition-colors focus:border-[#F78736] focus:outline-none"
          />
        </div>
      </div>

      {/* ── 2. Categorías ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-[6px] bg-[#292929] p-4">
        <p className="text-xs font-semibold text-white">
          {isProfesionales ? "Categoría principal" : "Categorías"}
        </p>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2.5 text-xs text-[#A8A8AA] transition-colors hover:text-white select-none"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => onCategoryToggle(cat)}
                className="h-4 w-4 cursor-pointer rounded border-[#323232] bg-transparent accent-[#F78736]"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── 3. Ubicación ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-[6px] bg-[#292929] p-4">
        <p className="text-xs font-semibold text-white">
          {isProfesionales ? "Buscar por" : "Ubicación actual"}
        </p>

        {isProfesionales && (
          <p className="text-xs text-[#A8A8AA]">Localidad o código postal.</p>
        )}

        {isProfesionales ? (
          <div className="flex items-center gap-2.5 rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2">
            <MapPinIcon className="h-4 w-4 shrink-0 text-[#A8A8AA]" />
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#A8A8AA] leading-tight">
                TU UBICACIÓN ES
              </span>
              <span className="block text-xs text-white">
                Ubicación
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2.5">
            <MapPinIcon className="h-4 w-4 shrink-0 text-[#A8A8AA]" />
            <span className="text-xs text-[#A8A8AA] truncate">{location}</span>
          </div>
        )}

        <button
          type="button"
          onClick={onOpenMap}
          className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#323232] bg-transparent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#323232] cursor-pointer"
        >
          <MapIcon className="h-4 w-4 text-[#A8A8AA]" />
          <span>Ver en mapa</span>
        </button>
      </div>

      {/* ── 4. Botones de Acción ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onApply}
          className="w-full rounded-[6px] bg-[#323232] border border-[#323232] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#3f3f3f] cursor-pointer"
        >
          Aplicar Filtros
        </button>
        <button
          type="button"
          onClick={onClear}
          className="w-full rounded-[6px] border border-[#323232] bg-transparent px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#292929] cursor-pointer"
        >
          Limpiar Filtros
        </button>
      </div>
    </aside>
  );
}
