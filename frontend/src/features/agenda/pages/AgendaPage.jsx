import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  ClockIcon,
  CalendarDaysIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

// UI Components
import PageHeader from "../../../components/ui/PageHeader";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import Button from "../../../components/ui/Button";
import Tabs from "../../../components/ui/Tabs";
import Select from "../../../components/ui/Select";
import FilterBar from "../../../components/ui/FilterBar";
import EmptyState from "../../../components/ui/EmptyState";

// The icons for tabs
const TABS = [
  { id: "solicitudes", label: "Solicitudes", icon: DocumentTextIcon },
  { id: "proximos", label: "Próximos Turnos", icon: CalendarIcon },
  { id: "historial", label: "Historial", icon: ClockIcon },
];

export default function AgendaPage() {
  const [activeTab, setActiveTab] = useState("solicitudes");
  const [sortOrder, setSortOrder] = useState("newest");
  const navigate = useNavigate();
  
  // Fake user name as there's no real backend yet
  const userName = "Nombre";

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: "Inicio", href: "/client/home" },
    { label: "Mi Agenda" },
  ];

  // Options for sort
  const sortOptions = [
    { value: "newest", label: "Más nuevo" },
    { value: "oldest", label: "Más antiguo" },
  ];

  // Dummy active filters to match the design
  const activeFilters = [
    { id: "sort", label: "Más nuevo" }
  ];

  const renderEmptyState = () => {
    switch (activeTab) {
      case "solicitudes":
        return (
          <EmptyState
            icon={CalendarIcon}
            title="No tenés solicitudes activas"
            description="Comenzá hoy mismo. Publicá lo que necesitás y recibí presupuestos de los mejores profesionales en tu zona."
            action={
              <Button variant="primary" onClick={() => navigate("/client/agenda/create-request")}>
                Publicar mi primera solicitud
              </Button>
            }
            className="bg-[#292929] rounded-[8px] min-h-[400px]"
          />
        );
      case "proximos":
        return (
          <EmptyState
            icon={CalendarDaysIcon}
            title="No tenés turnos programados"
            description="Cuando confirmes un servicio, tus próximos turnos aparecerán acá."
            className="bg-[#292929] rounded-[8px] min-h-[400px]"
          />
        );
      case "historial":
        return (
          <EmptyState
            icon={ClockIcon}
            title="Todavía no hay historial"
            description="Tus solicitudes y turnos finalizados o cancelados aparecerán acá."
            className="bg-[#292929] rounded-[8px] min-h-[400px]"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col text-white">
      {/* Top area */}
      <div className="mb-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="mb-8 border-b border-[#3f3f3f]">
        <PageHeader
          title={`Buenos días, ${userName}`}
          subtitle="Gestioná tus solicitudes, turnos e historial."
          actions={
            <Button variant="primary" className="px-5 py-2 text-sm font-medium" onClick={() => navigate("/client/agenda/create-request")}>
              <PlusIcon className="h-4 w-4 stroke-2" /> Crear Nueva Solicitud
            </Button>
          }
          className="mb-8"
        />
        
        <Tabs 
          tabs={TABS} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
      </div>

      {/* Filters and sorting */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white">
            Tenés 0 {activeTab === "solicitudes" ? "solicitudes encontradas" : activeTab === "proximos" ? "turnos encontrados" : "turnos encontrados"}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#A8A8AA]">Ordenar por:</span>
            <div className="w-40">
              <Select
                options={sortOptions}
                value={sortOrder}
                onChange={setSortOrder}
              />
            </div>
          </div>
        </div>
        
        <FilterBar 
          filters={activeFilters} 
          onRemoveFilter={(id) => console.log('Remove filter', id)} 
        />
      </div>

      {/* Main content - Empty State */}
      <div className="rounded-[8px]">
        {renderEmptyState()}
      </div>
    </div>
  );
}
