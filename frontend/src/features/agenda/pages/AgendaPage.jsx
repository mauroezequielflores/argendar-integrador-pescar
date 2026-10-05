import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../libs/axios";
import { useTurnos, useSolicitudes } from "../hooks/useAgendaQueries";
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
import SolicitudCard from "../components/SolicitudCard";
import OfertasRecibidasModal from "../components/OfertasRecibidasModal";
import SolicitudDetailModal from "../../marketplace/components/SolicitudDetailModal";
import TurnoCard from "../components/TurnoCard";
import TurnoDetalleModal from "../components/TurnoDetalleModal";

// The icons for tabs
const TABS = [
  { id: "solicitudes", label: "Solicitudes", icon: DocumentTextIcon },
  { id: "proximos", label: "Próximos Turnos", icon: CalendarIcon },
  { id: "historial", label: "Historial", icon: ClockIcon },
];

export default function AgendaPage() {
  const [activeTab, setActiveTab] = useState("solicitudes");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isOfertasModalOpen, setIsOfertasModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isSolicitudDetalleOpen, setIsSolicitudDetalleOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const [isTurnoDetalleOpen, setIsTurnoDetalleOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const navigate = useNavigate();

  const { data: solicitudes = [], isLoading: isLoadingSolicitudes, isError: isErrorSolicitudes, refetch: refetchSolicitudes } = useSolicitudes();
  const { data: appointmentsData, isLoading: isLoadingAppointments, isError: isErrorAppointments } = useTurnos(activeTab);

  const appointments = appointmentsData?.appointments || [];

  const [userProfile, setUserProfile] = useState({ firstName: "" });

  const fetchProfile = async () => {
    try {
      const response = await api.get('/client/profile');
      setUserProfile({
        firstName: response.data.firstName || "",
      });
    } catch (error) {
      console.error("Error fetching client profile for header:", error);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);


  const userName = userProfile.firstName ? `${userProfile.firstName}` : "Cliente...";

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: "Actividad", href: "/client/home" },
    { label: "Mi Agenda" },
  ];

  // Options for sort
  const sortOptions = [
    { value: "newest", label: "Más nuevo" },
    { value: "oldest", label: "Más antiguo" },
  ];

  const activeFilters = sortOrder ? [
    { id: "sort", label: sortOptions.find(o => o.value === sortOrder)?.label || "Más nuevo" }
  ] : [];

  const handleRemoveFilter = (id) => {
    if (id === "sort") {
      setSortOrder("");
    }
  };

  const handleVerOfertas = (requestId) => {
    setSelectedRequestId(requestId);
    setIsOfertasModalOpen(true);
  };

  const handleVerDetalle = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setIsSolicitudDetalleOpen(true);
  };

  const handleVerDetalleTurno = (turno) => {
    setSelectedTurno(turno);
    setIsTurnoDetalleOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "solicitudes":
        if (isLoadingSolicitudes) {
          return <div className="text-white p-8 text-center bg-[#292929] rounded-[8px]">Cargando solicitudes...</div>;
        }
        if (isErrorSolicitudes) {
          return <div className="text-red-400 p-8 text-center bg-[#292929] rounded-[8px]">Ocurrió un error al cargar las solicitudes.</div>;
        }
        if (solicitudes.length > 0) {
          const sortedSolicitudes = [...solicitudes].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
          });

          return (
            <div className="flex flex-col gap-4">
              {sortedSolicitudes.map((sol) => (
                <SolicitudCard
                  key={sol.id}
                  solicitud={sol}
                  onVerDetalle={() => handleVerDetalle(sol)}
                  onVerOfertas={() => handleVerOfertas(sol.id)}
                />
              ))}
            </div>
          );
        }
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
      case "historial":
        if (isLoadingAppointments) {
          return <div className="text-white p-8 text-center bg-[#292929] rounded-[8px]">Cargando turnos...</div>;
        }
        if (isErrorAppointments) {
          return <div className="text-red-400 p-8 text-center bg-[#292929] rounded-[8px]">Ocurrió un error al cargar los turnos.</div>;
        }
        if (appointments.length > 0) {
          const sortedAppointments = [...appointments].sort((a, b) => {
            const dateA = new Date(a.fecha).getTime();
            const dateB = new Date(b.fecha).getTime();
            return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
          });

          return (
            <div className="flex flex-col gap-4">
              {sortedAppointments.map((app) => (
                <TurnoCard
                  key={app.id}
                  turno={app}
                  onVerDetalle={() => handleVerDetalleTurno(app)}
                />
              ))}
            </div>
          );
        }
        return (
          <EmptyState
            icon={activeTab === 'proximos' ? CalendarDaysIcon : ClockIcon}
            title={activeTab === 'proximos' ? "No tenés turnos programados" : "Todavía no hay historial"}
            description={activeTab === 'proximos' ? "Cuando confirmes un servicio, tus próximos turnos aparecerán acá." : "Tus solicitudes y turnos finalizados o cancelados aparecerán acá."}
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
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="mb-6 border-b border-[#3f3f3f]">
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
            Tenés {activeTab === "solicitudes" ? solicitudes.length : appointments.length} {activeTab === "solicitudes" ? (solicitudes.length === 1 ? "solicitud encontrada" : "solicitudes encontradas") : (appointments.length === 1 ? "turno encontrado" : "turnos encontrados")}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#A8A8AA]">Ordenar por:</span>
            <div className="w-40">
              <Select
                options={sortOptions}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                classNameSelect="px-2 py-1 text-xs border border-[#3f3f3f] bg-[#292929]"
              />
            </div>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <FilterBar
            filters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
          />
        )}
      </div>

      {/* Main content */}
      <div className="rounded-[8px]">
        {renderContent()}
      </div>

      {isOfertasModalOpen && selectedRequestId && (
        <OfertasRecibidasModal
          isOpen={isOfertasModalOpen}
          onClose={() => setIsOfertasModalOpen(false)}
          requestId={selectedRequestId}
          onOfertaAceptada={() => {
            setIsOfertasModalOpen(false);
            refetchSolicitudes(); // Refrescar las solicitudes
          }}
        />
      )}

      {isSolicitudDetalleOpen && selectedSolicitud && (
        <SolicitudDetailModal
          isOpen={isSolicitudDetalleOpen}
          onClose={() => setIsSolicitudDetalleOpen(false)}
          solicitudId={selectedSolicitud.id}
          preloadedData={{
            id: selectedSolicitud.id,
            cliente: { nombre: userProfile.firstName, inicial: "" },
            categoria: selectedSolicitud.category?.name || "General",
            titulo: selectedSolicitud.title || "",
            descripcion: selectedSolicitud.description || "",
            cuestionario: {
              tieneMateriales: selectedSolicitud.has_materials,
              esUrgencia: selectedSolicitud.is_emergency,
              cuandoLoNecesita: selectedSolicitud.date_preference,
              antiguedad: selectedSolicitud.installation_age
            },
            ubicacion: [selectedSolicitud.neighborhood, selectedSolicitud.city].filter(Boolean).join(", "),
            horarioPreferencia: selectedSolicitud.time_preference || "",
            imagenesUrl: selectedSolicitud.photos?.map(p => p.storage_path) || []
          }}
          readOnly={true}
        />
      )}

      {isTurnoDetalleOpen && selectedTurno && (
        <TurnoDetalleModal
          isOpen={isTurnoDetalleOpen}
          turno={selectedTurno}
          onClose={() => setIsTurnoDetalleOpen(false)}
          onConfirmarPago={() => { }}
          onReprogramar={() => { }}
          onFinalizar={() => { }}
          isHistory={activeTab === "historial"}
        />
      )}
    </div>
  );
}
