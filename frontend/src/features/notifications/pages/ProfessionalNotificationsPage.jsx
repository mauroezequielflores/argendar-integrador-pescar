import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { ROUTES } from "../../../constants/routes";
import EmptyState from "../../../components/ui/EmptyState";
import {
  mockNotificaciones,
  mockHistorialNotificaciones,
} from "../data/mockProfessionalNotifications";

// ─── Tabs config ─────────────────────────────────────────────────────────────

const TABS = [
  { id: "todas", label: "Todas mis notificaciones", icon: BellIcon },
  { id: "historial", label: "Historial", icon: ClockIcon },
];

// ─── Subcomponentes ──────────────────────────────────────────────────────────

function TabNav({ active, onChange }) {
  return (
    <div className="flex gap-6 border-b border-[#323232]">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
              isActive
                ? "border-b-2 border-[#F78736] text-white"
                : "text-[#A8A8AA] hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function FilterBar({ count }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-white">
        Tenés <span className="font-semibold">{count}</span> notificaciones encontradas
      </p>
      <div className="flex items-center gap-2 text-sm text-[#A8A8AA]">
        Ordenar por:
        <span className="rounded-[6px] border border-[#323232] bg-[#292929] px-3 py-1 text-white text-xs">
          Todo
        </span>
      </div>
    </div>
  );
}

function FilterChips() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#A8A8AA]">Filtros</span>
      <span className="text-xs text-[#A8A8AA]">|</span>
      <span className="flex items-center gap-1 rounded-[6px] bg-[#323232] px-2 py-1 text-xs text-white">
        Todo
        <XMarkIcon className="h-3 w-3 text-[#A8A8AA]" />
      </span>
    </div>
  );
}

// ─── Paneles ─────────────────────────────────────────────────────────────────

function PanelTodas({ items }) {
  return (
    <div className="flex flex-col gap-3">
      <FilterBar count={items.length} />
      <FilterChips />
      <div className="rounded-[6px] border border-[#323232] bg-[#292929]">
        {items.length === 0 ? (
          <EmptyState
            icon={BellIcon}
            title="No tenés notificaciones"
            description="Te avisaremos cuando ocurra algo importante."
          />
        ) : (
          <div className="flex flex-col divide-y divide-[#323232]">
            {items.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-4">
                <div className="mt-0.5 rounded-full bg-[#323232] p-2">
                  <BellIcon className="h-4 w-4 text-[#F78736]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-white">{n.titulo}</p>
                  <p className="text-xs text-[#A8A8AA]">{n.descripcion}</p>
                  <p className="text-xs text-[#727272]">{n.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PanelHistorial({ items }) {
  return (
    <div className="flex flex-col gap-3">
      <FilterBar count={items.length} />
      <FilterChips />
      <div className="rounded-[6px] border border-[#323232] bg-[#292929]">
        {items.length === 0 ? (
          <EmptyState
            icon={BellIcon}
            title="No tenés notificaciones leídas"
            description="Te avisaremos cuando ocurra algo importante."
          />
        ) : (
          <div className="flex flex-col divide-y divide-[#323232]">
            {items.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-4">
                <div className="mt-0.5 rounded-full bg-[#323232] p-2">
                  <BellIcon className="h-4 w-4 text-[#A8A8AA]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-white">{n.titulo}</p>
                  <p className="text-xs text-[#A8A8AA]">{n.descripcion}</p>
                  <p className="text-xs text-[#727272]">{n.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProfessionalNotificationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("todas");

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#A8A8AA]">
        <span
          className="cursor-pointer hover:text-white transition-colors"
          onClick={() => navigate(ROUTES.PROFESSIONAL_AGENDA)}
        >
          Inicio
        </span>
        <span>/</span>
        <span className="text-white">Notificaciones</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Mis notificaciones</h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">
          Gestioná tus notificaciones de pagos, turnos y servicios.
        </p>
      </div>

      {/* Tabs */}
      <TabNav active={activeTab} onChange={setActiveTab} />

      {/* Contenido del tab activo */}
      {activeTab === "todas" && <PanelTodas items={mockNotificaciones} />}
      {activeTab === "historial" && (
        <PanelHistorial items={mockHistorialNotificaciones} />
      )}
    </div>
  );
}
