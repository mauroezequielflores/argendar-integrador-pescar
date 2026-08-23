import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  RectangleStackIcon,
  ClockIcon,
  PlusIcon,
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../../../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import EmptyState from "../../../components/ui/EmptyState";
import {
  mockProximosTurnos,
  mockOfertasPendientes,
  mockHistorial,
} from "../data/mockProfessionalAgenda";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

function formatFecha(fechaISO) {
  const [year, month, day] = fechaISO.split("-");
  return `${day}/${month}/${year}`;
}

// ─── Tabs config ────────────────────────────────────────────────────────────

const TABS = [
  { id: "turnos", label: "Próximos Turnos", icon: CalendarIcon },
  { id: "ofertas", label: "Ofertas pendientes", icon: RectangleStackIcon },
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

function FilterBar({ count, label }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-white">
        Tenés <span className="font-semibold">{count}</span> {label}
      </p>
      <div className="flex items-center gap-2 text-sm text-[#A8A8AA]">
        Ordenar por:
        <span className="rounded-[6px] border border-[#323232] bg-[#292929] px-3 py-1 text-white text-xs">
          Más nuevo
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
        Más nuevo
        <XMarkIcon className="h-3 w-3 text-[#A8A8AA]" />
      </span>
    </div>
  );
}

function OfertaCard({ oferta }) {
  return (
    <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{oferta.servicio}</p>
          <p className="text-xs text-[#A8A8AA] mt-0.5">{oferta.cliente}</p>
        </div>
        <span className="rounded-full bg-[#323232] px-2.5 py-1 text-xs text-[#F78736] font-medium">
          Pendiente
        </span>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-[#A8A8AA]">
        <span className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          {formatFecha(oferta.fecha)} · {oferta.hora}
        </span>
        <span className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          {oferta.direccion}
        </span>
        <span className="flex items-center gap-1">
          <CurrencyDollarIcon className="h-4 w-4" />
          ${oferta.monto.toLocaleString("es-AR")}
        </span>
      </div>
    </div>
  );
}

// ─── Paneles ─────────────────────────────────────────────────────────────────

function PanelProximosTurnos({ items }) {
  return (
    <div className="flex flex-col gap-3">
      <FilterBar
        count={items.length}
        label={items.length === 1 ? "turno encontrado" : "turnos encontradas"}
      />
      <FilterChips />
      <div className="rounded-[6px] border border-[#323232] bg-[#292929]">
        {items.length === 0 ? (
          <EmptyState
            icon={CalendarIcon}
            title="No tenés turnos programados"
            description="Cuando se confirme un servicio, tus próximos turnos aparecerán acá."
          />
        ) : (
          <div className="flex flex-col gap-3 p-4">
            {items.map((turno) => (
              <div key={turno.id} className="text-sm text-white">
                {turno.servicio}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PanelOfertas({ items }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      <FilterBar
        count={items.length}
        label={items.length === 1 ? "oferta pendiente" : "ofertas pendientes"}
      />
      <FilterChips />
      {items.length === 0 ? (
        <div className="rounded-[6px] border border-[#323232] bg-[#292929]">
          <EmptyState
            icon={RectangleStackIcon}
            title="No tenés ofertas pendientes"
            description="Explorá solicitudes de clientes y enviá tu primera oferta."
            action={
              <button
                onClick={() => navigate(ROUTES.PROFESSIONAL_MARKETPLACE)}
                className="mt-1 rounded-[6px] bg-[#F78736] px-4 py-2 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors"
              >
                Explorar solicitudes de clientes
              </button>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((oferta) => (
            <OfertaCard key={oferta.id} oferta={oferta} />
          ))}
        </div>
      )}
    </div>
  );
}

function PanelHistorial({ items }) {
  return (
    <div className="flex flex-col gap-3">
      <FilterBar
        count={items.length}
        label={items.length === 1 ? "turno encontrado" : "turnos encontradas"}
      />
      <FilterChips />
      <div className="rounded-[6px] border border-[#323232] bg-[#292929]">
        {items.length === 0 ? (
          <EmptyState
            icon={ClockIcon}
            title="Todavía no hay historial"
            description="Tus ofertas y turnos finalizados o cancelados aparecerán acá."
          />
        ) : (
          <div className="flex flex-col gap-3 p-4">
            {items.map((item) => (
              <div key={item.id} className="text-sm text-white">
                {item.servicio}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function ProfessionalAgendaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("turnos");

  const greeting = getGreeting();
  const firstName = user?.name ?? "Profesional";

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
        <span className="text-white">Mi Agenda</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-[#A8A8AA]">
            Gestioná tus turnos y ofertas pendientes.
          </p>
        </div>
        <button
          onClick={() => {}}
          className="flex shrink-0 items-center gap-2 rounded-[6px] bg-[#F78736] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e06d00] transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Crear Oferta
        </button>
      </div>

      {/* Tabs */}
      <TabNav active={activeTab} onChange={setActiveTab} />

      {/* Contenido del tab activo */}
      {activeTab === "turnos" && (
        <PanelProximosTurnos items={mockProximosTurnos} />
      )}
      {activeTab === "ofertas" && (
        <PanelOfertas items={mockOfertasPendientes} />
      )}
      {activeTab === "historial" && (
        <PanelHistorial items={mockHistorial} />
      )}
    </div>
  );
}
