import React, { useState, useMemo } from "react";
import {
  AcademicCapIcon,
  BuildingStorefrontIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// Componentes UI Compartidos
import Breadcrumbs from "../../../components/ui/Breadcrumbs";

// Subcomponentes del Marketplace
import MarketplaceFilterSidebar from "../components/MarketplaceFilterSidebar";
import MarketplaceActiveChips from "../components/MarketplaceActiveChips";
import ProfessionalCard from "../components/ProfessionalCard";
import SolicitudCard from "../components/SolicitudCard";

// Mock Data (Listas vacías por defecto según diseño)
import {
  mockProfessionals,
  mockSolicitudes,
  CATEGORIAS_MARKETPLACE,
  UBICACION_CLIENTE_DEFAULT,
  SORT_OPTIONS,
} from "../data/mockClientMarketplace";

/**
 * MarketplacePage — Pantalla principal del Marketplace (Cliente).
 * Ruta: /client/marketplace
 */
export default function MarketplacePage() {
  // Pestaña activa: "profesionales" | "solicitudes"
  const [activeTab, setActiveTab] = useState("profesionales");

  // ─── Filtros para PROFESIONALES ───────────────────────────────────────────
  const [profSearch, setProfSearch] = useState("");
  const [profCategories, setProfCategories] = useState(["Plomería"]);

  // Filtros aplicados para PROFESIONALES (Inicializado con Plomería como en la imagen)
  const [appliedProfSearch, setAppliedProfSearch] = useState("");
  const [appliedProfCategories, setAppliedProfCategories] = useState(["Plomería"]);

  // ─── Filtros para SOLICITUDES ─────────────────────────────────────────────
  const [solSearch, setSolSearch] = useState("");
  const [solCategories, setSolCategories] = useState(["Plomería"]);

  // Filtros aplicados para SOLICITUDES (Inicializado con Plomería como en la imagen)
  const [appliedSolSearch, setAppliedSolSearch] = useState("");
  const [appliedSolCategories, setAppliedSolCategories] = useState(["Plomería"]);

  // ─── Ordenamiento ──────────────────────────────────────────────────────────
  const [sortOrder, setSortOrder] = useState("newest");

  // ─── Handlers de Selección de Categorías ──────────────────────────────────
  const handleProfCategoryToggle = (cat) => {
    setProfCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSolCategoryToggle = (cat) => {
    setSolCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // ─── Handlers para Aplicar y Limpiar Filtros ──────────────────────────────
  const handleApplyFilters = () => {
    if (activeTab === "profesionales") {
      setAppliedProfSearch(profSearch);
      setAppliedProfCategories(profCategories);
    } else {
      setAppliedSolSearch(solSearch);
      setAppliedSolCategories(solCategories);
    }
  };

  const handleClearFilters = () => {
    if (activeTab === "profesionales") {
      setProfSearch("");
      setProfCategories([]);
      setAppliedProfSearch("");
      setAppliedProfCategories([]);
    } else {
      setSolSearch("");
      setSolCategories([]);
      setAppliedSolSearch("");
      setAppliedSolCategories([]);
    }
  };

  // ─── Handlers para Remover Chips Individuales ─────────────────────────────
  const handleRemoveProfCategory = (cat) => {
    const updated = appliedProfCategories.filter((c) => c !== cat);
    setAppliedProfCategories(updated);
    setProfCategories(updated);
  };

  const handleRemoveSolCategory = (cat) => {
    const updated = appliedSolCategories.filter((c) => c !== cat);
    setAppliedSolCategories(updated);
    setSolCategories(updated);
  };

  const handleRemoveSearch = () => {
    if (activeTab === "profesionales") {
      setProfSearch("");
      setAppliedProfSearch("");
    } else {
      setSolSearch("");
      setAppliedSolSearch("");
    }
  };

  const handleRemoveSort = () => {
    setSortOrder("");
  };

  // ─── Filtrado de Resultados ────────────────────────────────────────────────
  const filteredProfessionals = useMemo(() => {
    return mockProfessionals.filter((p) => {
      const search = appliedProfSearch.trim().toLowerCase();
      const matchesSearch =
        search === "" ||
        p.nombre.toLowerCase().includes(search) ||
        p.profesion.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search);

      const matchesCategory =
        appliedProfCategories.length === 0 ||
        appliedProfCategories.includes(p.categoria);

      return matchesSearch && matchesCategory;
    });
  }, [appliedProfSearch, appliedProfCategories]);

  const filteredSolicitudes = useMemo(() => {
    return mockSolicitudes.filter((s) => {
      const search = appliedSolSearch.trim().toLowerCase();
      const matchesSearch =
        search === "" ||
        s.titulo.toLowerCase().includes(search) ||
        s.descripcion.toLowerCase().includes(search);

      const matchesCategory =
        appliedSolCategories.length === 0 ||
        appliedSolCategories.includes(s.categoria);

      return matchesSearch && matchesCategory;
    });
  }, [appliedSolSearch, appliedSolCategories]);

  const sortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortOrder)?.label || (sortOrder ? "Más nuevo" : "");

  // Breadcrumbs contextuales según pestaña activa (CA07)
  const breadcrumbs =
    activeTab === "profesionales"
      ? [
          { label: "Descubrir", href: "/client/marketplace" },
          { label: "Marketplace" },
        ]
      : [
          { label: "Solicitud", href: "/client/marketplace" },
          { label: "Categoría" },
        ];

  return (
    <div className="flex flex-col gap-6 text-white font-sans">
      {/* ── Breadcrumb (CA07) ──────────────────────────────────────────────── */}
      <Breadcrumbs items={breadcrumbs} />

      {/* ── Encabezado (CA01) ──────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold leading-tight text-white">Marketplace</h1>
        <p className="mt-1 text-xs sm:text-sm text-[#A8A8AA]">
          {activeTab === "profesionales"
            ? "Encontrá profesionales técnicos compatibles con tu problema o necesidad."
            : "Encontrá profesionales y solicitudes cercanas a tu hogar."}
        </p>
      </div>

      {/* ── Pestañas de Navegación (CA02) ─────────────────────────────────── */}
      <div className="flex border-b border-[#323232]">
        <button
          type="button"
          onClick={() => setActiveTab("profesionales")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "profesionales"
              ? "border-b-2 border-[#F78736] text-white"
              : "border-b-2 border-transparent text-[#A8A8AA] hover:text-white"
          }`}
        >
          <AcademicCapIcon className="h-4 w-4" />
          <span>Profesionales</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("solicitudes")}
          className={`ml-6 flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "solicitudes"
              ? "border-b-2 border-[#F78736] text-white"
              : "border-b-2 border-transparent text-[#A8A8AA] hover:text-white"
          }`}
        >
          <BuildingStorefrontIcon className="h-4 w-4" />
          <span>Solicitudes publicadas</span>
        </button>
      </div>

      {/* ── Contenido Principal (Filtros + Resultados) ────────────────────── */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* ── Barra Lateral de Filtros (CA03, CA04, CA05) ─────────────────── */}
        <MarketplaceFilterSidebar
          tab={activeTab}
          searchText={activeTab === "profesionales" ? profSearch : solSearch}
          onSearchChange={
            activeTab === "profesionales" ? setProfSearch : setSolSearch
          }
          categories={CATEGORIAS_MARKETPLACE}
          selectedCategories={
            activeTab === "profesionales" ? profCategories : solCategories
          }
          onCategoryToggle={
            activeTab === "profesionales"
              ? handleProfCategoryToggle
              : handleSolCategoryToggle
          }
          location={UBICACION_CLIENTE_DEFAULT}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          onOpenMap={() => {}}
        />

        {/* ── Área de Resultados ────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-3 w-full">
          {/* Fila: Contador de Resultados + Desplegable Ordenar (CA03, CA04) */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-white">
              Se encontraron{" "}
              <span className="font-semibold">
                {activeTab === "profesionales"
                  ? filteredProfessionals.length
                  : filteredSolicitudes.length}
              </span>{" "}
              {activeTab === "profesionales" ? "profesionales" : "solicitudes"}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#A8A8AA]">
              <span>Ordenar por:</span>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="cursor-pointer appearance-none rounded-[6px] border border-[#323232] bg-[#292929] pl-3 pr-7 py-1.5 text-xs text-white transition-colors focus:border-[#F78736] focus:outline-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#292929] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A8A8AA]" />
              </div>
            </div>
          </div>

          {/* Chips de Filtros Activos (CA05) */}
          <MarketplaceActiveChips
            sortLabel={sortLabel}
            appliedSearch={
              activeTab === "profesionales" ? appliedProfSearch : appliedSolSearch
            }
            appliedCategories={
              activeTab === "profesionales"
                ? appliedProfCategories
                : appliedSolCategories
            }
            onRemoveSort={handleRemoveSort}
            onRemoveSearch={handleRemoveSearch}
            onRemoveCategory={
              activeTab === "profesionales"
                ? handleRemoveProfCategory
                : handleRemoveSolCategory
            }
          />

          {/* Título de Sección (CA03, CA04) */}
          <h2 className="text-sm sm:text-base font-semibold text-white mt-1">
            {activeTab === "profesionales"
              ? "Profesionales Recomendados"
              : "Solicitudes nuevas"}
          </h2>

          {/* ── Contenedor Vacío (Empty State) según la imagen (CA06) ──────── */}
          {activeTab === "profesionales" ? (
            filteredProfessionals.length === 0 ? (
              <div className="rounded-[6px] bg-[#292929] min-h-[460px] flex flex-col items-center justify-center p-8 text-center border border-transparent">
                <div className="rounded-full bg-[#323232] p-3.5 mb-3 flex items-center justify-center">
                  <BuildingStorefrontIcon className="h-7 w-7 text-[#A8A8AA]" />
                </div>
                <p className="text-sm font-semibold text-white">
                  No se encontraron resultados
                </p>
                <p className="text-xs text-[#A8A8AA] mt-1">
                  Intenta ajustar tus filtros o buscar algo diferente
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredProfessionals.map((prof) => (
                  <ProfessionalCard key={prof.id} professional={prof} />
                ))}
              </div>
            )
          ) : filteredSolicitudes.length === 0 ? (
            <div className="rounded-[6px] bg-[#292929] min-h-[460px] flex flex-col items-center justify-center p-8 text-center border border-transparent">
              <div className="rounded-full bg-[#323232] p-3.5 mb-3 flex items-center justify-center">
                <BuildingStorefrontIcon className="h-7 w-7 text-[#A8A8AA]" />
              </div>
              <p className="text-sm font-semibold text-white">
                No se encontraron resultados
              </p>
              <p className="text-xs text-[#A8A8AA] mt-1">
                Intenta ajustar tus filtros o buscar algo diferente
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredSolicitudes.map((sol) => (
                <SolicitudCard key={sol.id} solicitud={sol} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
