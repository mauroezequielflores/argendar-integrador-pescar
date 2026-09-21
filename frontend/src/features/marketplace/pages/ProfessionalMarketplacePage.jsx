import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequests } from "../hooks/useMarketplaceQueries";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  MapIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

import { ROUTES } from "../../../constants/routes";
import EmptyState from "../../../components/ui/EmptyState";
import SolicitudDetailModal from "../components/SolicitudDetailModal";
import {
  CATEGORIAS,
  UBICACION_ACTUAL,
} from "../data/mockProfessionalMarketplace";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatFecha(fechaISO) {
  if (!fechaISO) return "";
  const date = new Date(fechaISO);
  // Formato ej: 17/09/2026
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function timeSince(fechaISO) {
  if (!fechaISO) return "";
  const date = new Date(fechaISO);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = seconds / 86400;
  if (interval > 1) {
    return `Publicado hace ${Math.floor(interval)} días`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `Publicado hace ${Math.floor(interval)} horas`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `Publicado hace ${Math.floor(interval)} min`;
  }
  return "Publicado hace unos instantes";
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

function SolicitudCard({ solicitud, onViewDetail }) {
  return (
    <div className="rounded-[6px] border border-[#323232] bg-[#292929] flex flex-col hover:border-[#404040] transition-colors">
      {/* Header Fila */}
      <div className="flex items-center justify-between border-b border-[#323232] px-4 py-2 text-[10px] uppercase font-semibold text-[#A8A8AA] tracking-wide">
        <div className="flex items-center gap-2">
          <span>SOLICITUD</span>
          <span>-</span>
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-3 w-3" />
            {solicitud.ubicacion}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" />
          <span>{timeSince(solicitud.fecha)}</span>
        </div>
      </div>

      {/* Main Content Fila */}
      <div className="px-4 pt-4 pb-2 flex gap-4">
        {/* Avatar Placeholder */}
        <div className="h-10 w-10 shrink-0 rounded-full bg-[#323232] flex items-center justify-center text-[#A8A8AA]">
          <UserIcon className="h-5 w-5" />
        </div>
        
        {/* Título y Descripción */}
        <div className="flex-1 flex flex-col gap-1">
          <h4 className="text-base font-bold text-white">{solicitud.titulo}</h4>
          <p className="text-xs text-[#A8A8AA] leading-relaxed line-clamp-2">
            {solicitud.descripcion}
          </p>
        </div>
      </div>

      {/* Footer Fila */}
      <div className="px-4 pb-4 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wide">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            Preferencia: {solicitud.cuestionario?.cuandoLoNecesita || 'Soy flexible'}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#A8A8AA]"></span>
          <span className="rounded-full bg-[#323232] px-2 py-0.5 text-[#F78736]">
            {solicitud.categoria}
          </span>
          <span className="h-1 w-1 rounded-full bg-[#A8A8AA]"></span>
          <span className="flex items-center gap-1 text-white">
            <ClockIcon className="h-3 w-3" />
            ESPERANDO OFERTAS...
          </span>
        </div>
        <button
          onClick={() => onViewDetail(solicitud.id)}
          className="flex items-center gap-1 text-xs text-white bg-[#323232] px-3 py-1.5 rounded-[6px] hover:bg-[#3f3f3f] transition-colors font-medium"
        >
          Ver detalle <ArrowRightIcon className="h-3 w-3" />
        </button>
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

  // Modal de detalle
  const [selectedRequestId, setSelectedRequestId] = useState(null);

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

  const filters = {
    search: appliedSearch || undefined,
    categories: appliedCategories.length > 0 ? appliedCategories.join(",") : undefined,
  };

  const { data: resultData, isLoading, isError } = useRequests(filters);

  const results = resultData?.data || [];

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
        <h1 className="text-2xl font-bold text-white">Marketplace</h1>
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
          {isLoading ? (
            <div className="text-white p-8 text-center bg-[#292929] rounded-[6px]">
              Cargando solicitudes...
            </div>
          ) : isError ? (
            <div className="text-red-400 p-8 text-center bg-[#292929] rounded-[6px]">
              Ocurrió un error al cargar el marketplace.
            </div>
          ) : results.length === 0 ? (
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
                <SolicitudCard
                  key={s.id}
                  solicitud={s}
                  onViewDetail={(id) => setSelectedRequestId(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <SolicitudDetailModal
        isOpen={selectedRequestId !== null}
        onClose={() => setSelectedRequestId(null)}
        solicitudId={selectedRequestId}
      />
    </div>
  );
}
