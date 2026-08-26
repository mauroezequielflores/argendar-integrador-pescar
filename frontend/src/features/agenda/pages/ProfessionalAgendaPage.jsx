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
  mockOfertasPendientes,
  mockHistorial,
} from "../data/mockProfessionalAgenda";

// Feature Components
import TurnoCard from "../components/TurnoCard";
import TurnoDetalleModal from "../components/TurnoDetalleModal";
import RechazoFinalizarModal from "../components/RechazoFinalizarModal";
import ExitoFinalizarModal from "../components/ExitoFinalizarModal";
import OfertaCard from "../components/OfertaCard";
import SolicitudDetalleModal from "../components/SolicitudDetalleModal";

// Data
import { mockAgenda } from "../data/mockAgenda";

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



// ─── Paneles ─────────────────────────────────────────────────────────────────

function PanelProximosTurnos({ items, onVerDetalle }) {
  return (
    <div className="flex flex-col gap-3">
      <FilterBar
        count={items.length}
        label={items.length === 1 ? "turno encontrado" : "turnos encontradas"}
      />
      <FilterChips />
      <div className="rounded-[6px] border-0">
        {items.length === 0 ? (
          <EmptyState
            icon={CalendarIcon}
            title="No tenés turnos programados"
            description="Cuando se confirme un servicio, tus próximos turnos aparecerán acá."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((turno) => (
              <TurnoCard key={turno.id} turno={turno} onVerDetalle={() => onVerDetalle(turno)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PanelOfertas({ items, onVerDetalle, onVerMiOferta }) {
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
            <OfertaCard 
              key={oferta.id} 
              oferta={oferta} 
              onVerDetalle={() => onVerDetalle(oferta)}
              onVerMiOferta={() => onVerMiOferta(oferta)}
            />
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
  
  // States for Agenda data
  const [turnos, setTurnos] = useState(mockAgenda);
  const [selectedTurno, setSelectedTurno] = useState(null);
  
  // Modal states
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [isRechazoOpen, setIsRechazoOpen] = useState(false);
  const [isExitoOpen, setIsExitoOpen] = useState(false);
  
  // States para Ofertas
  const [isSolicitudDetalleOpen, setIsSolicitudDetalleOpen] = useState(false);
  const [selectedOferta, setSelectedOferta] = useState(null);

  const greeting = getGreeting();
  const firstName = user?.name ?? "Profesional";

  // ─── Acciones ──────────────────────────────────────────────────────────────

  const handleVerDetalle = (turno) => {
    setSelectedTurno(turno);
    setIsDetalleOpen(true);
  };

  const handleVerDetalleOferta = (oferta) => {
    setSelectedOferta(oferta);
    setIsSolicitudDetalleOpen(true);
  };

  const handleVerMiOferta = (oferta) => {
    // Lógica para ver detalle de la propuesta enviada
    console.log("Ver mi oferta", oferta);
  };

  const handleConfirmarPago = () => {
    if (!selectedTurno) return;
    
    // Update the selected turno locally
    const updatedTurno = {
      ...selectedTurno,
      pago: {
        ...selectedTurno.pago,
        estado: "CONFIRMADO"
      }
    };
    setSelectedTurno(updatedTurno);
    
    // Update the main list
    setTurnos(turnos.map(t => t.id === updatedTurno.id ? updatedTurno : t));
  };

  const handleReprogramar = () => {
    // Logic for reprogramar, just close for now
    setIsDetalleOpen(false);
  };

  const handleFinalizarClick = () => {
    if (selectedTurno?.pago?.estado === "PENDIENTE") {
      setIsDetalleOpen(false);
      setIsRechazoOpen(true);
      return;
    }
    
    // Simulate backend response (success)
    setIsDetalleOpen(false);
    setIsExitoOpen(true);
    
    // Move to history in a real app, here we might just change status or filter it out
    if (selectedTurno) {
       setTurnos(turnos.map(t => t.id === selectedTurno.id ? {...t, estado: "FINALIZADO"} : t));
    }
  };

  const handleCloseRespuesta = () => {
    setIsExitoOpen(false);
    setIsRechazoOpen(false);
    setSelectedTurno(null);
  };

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
        <PanelProximosTurnos 
          items={turnos.filter(t => t.estado !== "FINALIZADO")} 
          onVerDetalle={handleVerDetalle} 
        />
      )}
      {activeTab === "ofertas" && (
        <PanelOfertas 
          items={mockOfertasPendientes} 
          onVerDetalle={handleVerDetalleOferta}
          onVerMiOferta={handleVerMiOferta}
        />
      )}
      {activeTab === "historial" && (
        <PanelHistorial items={mockHistorial} />
      )}

      {/* Modals */}
      <TurnoDetalleModal 
        isOpen={isDetalleOpen} 
        turno={selectedTurno}
        onClose={() => setIsDetalleOpen(false)}
        onConfirmarPago={handleConfirmarPago}
        onReprogramar={handleReprogramar}
        onFinalizar={handleFinalizarClick}
      />

      <RechazoFinalizarModal 
        isOpen={isRechazoOpen}
        onClose={handleCloseRespuesta}
      />

      <ExitoFinalizarModal 
        isOpen={isExitoOpen}
        onClose={handleCloseRespuesta}
      />
      
      <SolicitudDetalleModal
        isOpen={isSolicitudDetalleOpen}
        onClose={() => setIsSolicitudDetalleOpen(false)}
        oferta={selectedOferta}
      />
    </div>
  );
}
