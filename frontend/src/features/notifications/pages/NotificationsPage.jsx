import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ClockIcon } from "@heroicons/react/24/outline";

import { ROUTES } from "../../../constants/routes";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import Tabs from "../../../components/ui/Tabs";
import FilterBar from "../../../components/ui/FilterBar";
import SortSelect from "../../../components/ui/SortSelect";
import EmptyState from "../../../components/ui/EmptyState";
import NotificationCard from "../../../components/ui/NotificationCard";
import OfferSummary from "../components/OfferSummary";

import {
  mockClientNotificaciones,
  mockClientHistorial,
} from "../data/mockClientNotifications";

// ─── Configuración de pestañas ────────────────────────────────────────────────
const NOTIFICATION_TABS = [
  { id: "todas", label: "Todas mis notificaciones", icon: BellIcon },
  { id: "historial", label: "Historial", icon: ClockIcon },
];

// ─── Opciones de ordenamiento ────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "antiguos", label: "Más antiguos" },
];

// ─── Mapeo de labels para chips ───────────────────────────────────────────────
const SORT_LABELS = {
  todo: "Todo",
  antiguos: "Más antiguos",
};

/**
 * NotificationsPage — Pantalla de Notificaciones del Cliente.
 * Cumple con la Historia de Usuario y criterios CA01 a CA06.
 */
export default function NotificationsPage() {
  const navigate = useNavigate();

  // Estados locales para pestaña activa, orden y filtro
  const [activeTab, setActiveTab] = useState("todas");
  const [sortBy, setSortBy] = useState("todo");
  const [activeFilterId, setActiveFilterId] = useState("todo");
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: "Inicio", href: ROUTES.CLIENT_AGENDA || "/client/agenda" },
    { label: "Notificaciones" },
  ];

  // Lista base según pestaña activa
  const rawItems = activeTab === "todas" ? mockClientNotificaciones : mockClientHistorial;

  // Filtrado y ordenamiento de items
  const processedItems = useMemo(() => {
    if (!rawItems || rawItems.length === 0) return [];

    const itemsCopy = [...rawItems];

    if (sortBy === "antiguos") {
      // Ordenar más antiguos primero
      return itemsCopy.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    }

    // Por defecto (Todo / Más recientes)
    return itemsCopy.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [rawItems, sortBy]);

  // Manejador del cambio de ordenamiento
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setActiveFilterId(newSort);
  };

  // Manejador para remover chip de filtro
  const handleRemoveFilter = () => {
    setActiveFilterId(null);
    setSortBy("todo");
  };

  // Filtros activos a mostrar en FilterBar
  const activeFilters = useMemo(() => {
    if (!activeFilterId) return [];
    return [
      {
        id: activeFilterId,
        label: SORT_LABELS[activeFilterId] || "Todo",
      },
    ];
  }, [activeFilterId]);

  // Título dinámico para el estado vacío según la pestaña activa
  const emptyStateTitle =
    activeTab === "todas"
      ? "No tenés notificaciones"
      : "No tenés notificaciones leidas";

  return (
    <div className="flex flex-col gap-6 text-white max-w-7xl mx-auto w-full">
      {/* ─── Breadcrumb de navegación (CA01) ─── */}
      <Breadcrumbs items={breadcrumbItems} separator="/" />

      {/* ─── Encabezado principal (CA01) ─── */}
      <div>
        <h1 className="text-3xl lg:text-[32px] font-bold text-white tracking-tight">
          Mis notificaciones
        </h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">
          Gestioná tus notificaciones de pagos, turnos y servicios.
        </p>
      </div>

      {/* ─── Pestañas de navegación (CA02) ─── */}
      <Tabs
        tabs={NOTIFICATION_TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ─── Barra de conteo de resultados y Ordenar por (CA03 & CA06) ─── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm font-medium text-white">
            Tenés <span className="font-semibold">{processedItems.length}</span> notificaciones encontradas
          </p>
          <SortSelect
            label="Ordenar por:"
            value={sortBy}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
          />
        </div>

        {/* ─── Barra de filtros activos con chips (CA03) ─── */}
        {activeFilters.length > 0 && (
          <FilterBar
            filters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            label="Filtros |"
          />
        )}
      </div>

      {/* ─── Contenedor Principal: Empty State (CA04, CA05) o Lista de Notificaciones ─── */}
      <div className="w-full">
        {processedItems.length === 0 ? (
          <EmptyState
            icon={BellIcon}
            title={emptyStateTitle}
            description="Te avisaremos cuando ocurra algo importante."
            isCard={true}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {processedItems.map((notification) => (
              <NotificationCard
                key={notification.id}
                title={notification.titulo}
                description={notification.descripcion}
                time={notification.fecha}
                icon={notification.icon}
                iconBgColor={notification.iconBgColor}
                iconColor={notification.iconColor}
                isNew={notification.isNew}
                onClick={() => {
                  if (notification.tipo === "new_offer") {
                    setSelectedOffer(notification);
                    return;
                  }
                  navigate(notification.href || "#");
                }}
              />
            ))}
          </div>
        )}
      </div>

      {selectedOffer && (
        <OfferSummary
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          onViewProfile={() => navigate("/client/marketplace")}
          onAccept={() => {
            setSelectedOffer(null);
            navigate(ROUTES.CLIENT_AGENDA);
          }}
        />
      )}
    </div>
  );
}
