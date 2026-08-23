import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  MapIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { ROUTES } from "../../../constants/routes";
import EmptyState from "../../../components/ui/EmptyState";
import {
  mockSolicitudes,
  CATEGORIAS,
  UBICACION_ACTUAL,
} from "../data/mockProfessionalMarketplace";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatFecha(fechaISO) {
  const [year, month, day] = fechaISO.split("-");
  return `${day}/${month}/${year}`;
}

function applyFilters(solicitudes, { searchText, selectedCategories }) {
  return solicitudes.filter((s) => {
    const matchesSearch =
      searchText.trim() === "" ||
      s.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(s.categoria);
    return matchesSearch && matchesCategory;
  });
}

// ─── Subcomponentes ──────────────────────────────────────────────────────────

function FilterPanel({
  searchText,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  onApply,
  onClear,
}) {
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-4">
      {/* Buscar */}
      <div className="flex flex-col gap-2 rounded-[6px] bg-[#292929] p-4">
        <p className="text-xs font-semibold text-white">Buscar</p>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A8AA]" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ej. Reparación de caños"
            className="w-full rounded-[6px] border border-[#323232] bg-[#202020] py-2 pl-9 pr-3 text-xs text-white placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none"
          />
        </div>
      </div>

      {/* Categorías */}
      <div className="flex flex-col gap-3 rounded-[6px] bg-[#292929] p-4">
        <p className="text-xs font-semibold text-white">Categorías</p>
        {CATEGORIAS.map((cat) => (
          <label
            key={cat}
            className="flex cursor-pointer items-center gap-2 text-xs text-[#A8A8AA] hover:text-white"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => onCategoryToggle(cat)}
              className="h-4 w-4 rounded border-[#323232] bg-transparent accent-[#F78736] cursor-pointer"
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Ubicación actual */}
      <div className="flex flex-col gap-3 rounded-[6px] bg-[#292929] p-4">
        <p className="text-xs font-semibold text-white">Ubicación actual</p>
        <div className="flex items-center gap-2 rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2">
          <MapPinIcon className="h-4 w-4 shrink-0 text-[#A8A8AA]" />
          <span className="text-xs text-[#A8A8AA]">{UBICACION_ACTUAL}</span>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#323232] bg-transparent px-3 py-2 text-xs text-white hover:bg-[#323232] transition-colors">
          <MapIcon className="h-4 w-4" />
          Ver en mapa
        </button>
      </div>

      {/* Acciones */}
      <button
        onClick={onApply}
        className="w-full rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors"
      >
        Aplicar Filtros
      </button>
      <button
        onClick={onClear}
        className="w-full rounded-[6px] border border-[#323232] bg-transparent px-4 py-2.5 text-xs font-medium text-white hover:bg-[#292929] transition-colors"
      >
        Limpiar Filtros
      </button>
    </aside>
  );
}

function ActiveChips({ sortLabel, appliedCategories, onRemoveCategory }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-[#A8A8AA]">Filtros</span>
      <span className="text-xs text-[#A8A8AA]">|</span>
      <span className="rounded-[6px] bg-[#323232] px-2 py-1 text-xs text-white">
        {sortLabel}
      </span>
      {appliedCategories.map((cat) => (
        <span
          key={cat}
          className="flex items-center gap-1 rounded-[6px] bg-[#323232] px-2 py-1 text-xs text-white"
        >
          {cat}
          <button onClick={() => onRemoveCategory(cat)}>
            <XMarkIcon className="h-3 w-3 text-[#A8A8AA]" />
          </button>
        </span>
      ))}
    </div>
  );
}

function SolicitudCard({ solicitud }) {
  return (
    <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">{solicitud.titulo}</p>
          <p className="text-xs text-[#A8A8AA] mt-0.5">{solicitud.cliente}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#323232] px-2.5 py-1 text-xs text-[#F78736] font-medium">
          {solicitud.categoria}
        </span>
      </div>
      <p className="text-xs text-[#A8A8AA] leading-relaxed">{solicitud.descripcion}</p>
      <div className="flex items-center gap-4 text-xs text-[#A8A8AA]">
        <span className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          {solicitud.ubicacion}
        </span>
        <span>{formatFecha(solicitud.fecha)}</span>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProfessionalMarketplacePage() {
  const navigate = useNavigate();

  // Estado del panel de filtros (pendiente de aplicar)
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Estado de filtros aplicados (snapshot al hacer "Aplicar")
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategories, setAppliedCategories] = useState([]);

  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = () => {
    setAppliedSearch(searchText);
    setAppliedCategories(selectedCategories);
  };

  const handleClear = () => {
    setSearchText("");
    setSelectedCategories([]);
    setAppliedSearch("");
    setAppliedCategories([]);
  };

  const handleRemoveCategory = (cat) => {
    const updated = appliedCategories.filter((c) => c !== cat);
    setAppliedCategories(updated);
    setSelectedCategories(updated);
  };

  const results = applyFilters(mockSolicitudes, {
    searchText: appliedSearch,
    selectedCategories: appliedCategories,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#A8A8AA]">
        <span
          className="cursor-pointer hover:text-white transition-colors"
          onClick={() => navigate(ROUTES.PROFESSIONAL_MARKETPLACE)}
        >
          Solicitud
        </span>
        <span>&gt;</span>
        <span className="text-white">Categoría</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Marketplace</h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">
          Encontrá profesionales y solicitudes cercanas a tu hogar.
        </p>
      </div>

      {/* Tab */}
      <div className="flex border-b border-[#323232]">
        <button className="flex items-center gap-2 border-b-2 border-[#F78736] pb-3 text-sm font-medium text-white">
          <BuildingStorefrontIcon className="h-4 w-4" />
          Solicitudes publicadas
        </button>
      </div>

      {/* Contenido: filtros + resultados */}
      <div className="flex gap-6 items-start">
        {/* Panel de filtros */}
        <FilterPanel
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          onApply={handleApply}
          onClear={handleClear}
        />

        {/* Resultados */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Contador + ordenar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-white">
              Se encontraron{" "}
              <span className="font-semibold">{results.length}</span> solicitudes
            </p>
            <div className="flex items-center gap-2 text-sm text-[#A8A8AA]">
              Ordenar por:
              <span className="rounded-[6px] border border-[#323232] bg-[#292929] px-3 py-1 text-white text-xs">
                Más nuevo
              </span>
            </div>
          </div>

          {/* Chips de filtros activos */}
          <ActiveChips
            sortLabel="Más nuevo"
            appliedCategories={appliedCategories}
            onRemoveCategory={handleRemoveCategory}
          />

          {/* Título sección */}
          <p className="text-base font-semibold text-white">Solicitudes nuevas</p>

          {/* Cards o empty state */}
          {results.length === 0 ? (
            <div className="rounded-[6px] border border-[#323232] bg-[#292929]">
              <EmptyState
                icon={BuildingStorefrontIcon}
                title="No se encontraron resultados"
                description="Intenta ajustar tus filtros o buscar algo diferente."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {results.map((s) => (
                <SolicitudCard key={s.id} solicitud={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
