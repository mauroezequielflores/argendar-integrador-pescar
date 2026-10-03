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
import Modal from "../../../components/ui/Modal";
import { useProfileSettings } from "../../profile/hooks/useProfileQueries";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AddressAutocomplete from "../../../components/ui/AddressAutocomplete";
import { formatDatePreference, getSupabasePublicUrl } from "../../../utils/formatters";
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

const customIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F78736" class="w-8 h-8 -mt-8 -ml-4" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.5));">
          <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
         </svg>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// ─── Subcomponentes ──────────────────────────────────────────────────────────

function FilterPanel({
  searchText,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  withinRadius,
  onWithinRadiusChange,
  onApply,
  onClear,
  onLocationChange,
  userAddress,
  onShowMap
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onApply();
              }
            }}
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
        <AddressAutocomplete
          defaultValue={userAddress}
          onAddressSelect={onLocationChange}
          showMap={false}
          label=""
        />
        
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[#A8A8AA] hover:text-white mt-2">
          <input
            type="checkbox"
            checked={withinRadius}
            onChange={(e) => onWithinRadiusChange(e.target.checked)}
            className="h-4 w-4 rounded border-[#323232] bg-transparent accent-[#F78736] cursor-pointer"
          />
          Dentro de mi radio de trabajo
        </label>
        
        <button 
          onClick={onShowMap}
          className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#323232] bg-transparent px-3 py-2 text-xs text-white hover:bg-[#323232] transition-colors"
        >
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

function ActiveChips({ sortLabel, appliedSearch, onRemoveSearch, appliedCategories, onRemoveCategory, appliedWithinRadius, onRemoveWithinRadius }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-[#A8A8AA]">Filtros</span>
      <span className="text-xs text-[#A8A8AA]">|</span>
      <span className="rounded-[6px] bg-[#323232] px-2 py-1 text-xs text-white">
        {sortLabel}
      </span>
      {appliedSearch && (
        <span className="flex items-center gap-1 rounded-[6px] bg-[#323232] px-2 py-1 text-xs text-white">
          Búsqueda: {appliedSearch}
          <button onClick={onRemoveSearch}>
            <XMarkIcon className="h-3 w-3 text-[#A8A8AA]" />
          </button>
        </span>
      )}
      {appliedWithinRadius && (
        <span className="flex items-center gap-1 rounded-[6px] bg-[#323232] px-2 py-1 text-xs text-white">
          En mi radio
          <button onClick={onRemoveWithinRadius}>
            <XMarkIcon className="h-3 w-3 text-[#A8A8AA]" />
          </button>
        </span>
      )}
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
          {solicitud.isOutOfRange && (
            <span className="rounded-[4px] bg-red-500/20 text-red-400 px-2 py-0.5 ml-2 border border-red-500/30">
              Fuera de mi rango
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" />
          <span>{timeSince(solicitud.fecha)}</span>
        </div>
      </div>

      {/* Main Content Fila */}
      <div className="px-4 pt-4 pb-2 flex gap-4">
        {/* Avatar Placeholder */}
        <div className="h-10 w-10 shrink-0 rounded-full bg-[#323232] flex items-center justify-center overflow-hidden text-[#A8A8AA]">
          {solicitud.foto ? (
            <img src={getSupabasePublicUrl(solicitud.foto, 'avatars')} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <UserIcon className="h-5 w-5" />
          )}
        </div>
        
        {/* Título y Descripción */}
        <div className="flex-1 flex flex-col gap-1">
          <h4 className="text-base font-bold text-white">{solicitud.titulo}</h4>
          <p className="text-xs text-[#A8A8AA] leading-relaxed line-clamp-2">
            {solicitud.descripcion?.includes('Detalles:') 
              ? solicitud.descripcion.split('Detalles:')[0].trim() 
              : solicitud.descripcion}
          </p>
        </div>
      </div>

      {/* Footer Fila */}
      <div className="px-4 pb-4 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wide">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            Preferencia: {formatDatePreference(solicitud.cuestionario?.cuandoLoNecesita)}
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
  const [withinRadius, setWithinRadius] = useState(false);

  // Estado de filtros aplicados (snapshot al hacer "Aplicar")
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategories, setAppliedCategories] = useState([]);
  const [appliedWithinRadius, setAppliedWithinRadius] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [appliedSortOrder, setAppliedSortOrder] = useState("newest");

  // Modal de detalle
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  
  // Modal de mapa
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const { data: profileSettings, isSuccess } = useProfileSettings('professional');
  
  const [profLocation, setProfLocation] = useState("");
  const [profLat, setProfLat] = useState(null);
  const [profLng, setProfLng] = useState(null);
  const [isLocationInitialized, setIsLocationInitialized] = useState(false);

  const userRadius = profileSettings?.location?.coverageRadiusKm || 10;

  useEffect(() => {
    if (isSuccess && profileSettings?.location && !isLocationInitialized) {
      setProfLocation(profileSettings.location.address || UBICACION_ACTUAL);
      setProfLat(profileSettings.location.latitude || -34.603722);
      setProfLng(profileSettings.location.longitude || -58.381592);
      setIsLocationInitialized(true);
    }
  }, [isSuccess, profileSettings, isLocationInitialized]);

  useEffect(() => {
    if (isMapModalOpen && profLat && profLng && mapContainerRef.current) {
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
        }).setView([profLat, profLng], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        L.marker([profLat, profLng], { icon: customIcon }).addTo(map);

        const circle = L.circle([profLat, profLng], {
          color: '#F78736',
          fillColor: '#F78736',
          fillOpacity: 0.1,
          radius: userRadius * 1000
        }).addTo(map);

        mapInstanceRef.current = map;
        
        // Timeout para corregir tamaño luego de animación
        setTimeout(() => {
          map.invalidateSize();
          map.fitBounds(circle.getBounds());
        }, 300);
      } else {
        mapInstanceRef.current.setView([profLat, profLng], 13);
        
        // Cleanup old layers and add new ones (this is simple for markers/circles)
        mapInstanceRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Circle) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });
        
        L.marker([profLat, profLng], { icon: customIcon }).addTo(mapInstanceRef.current);
        const circle = L.circle([profLat, profLng], {
          color: '#F78736',
          fillColor: '#F78736',
          fillOpacity: 0.1,
          radius: userRadius * 1000
        }).addTo(mapInstanceRef.current);
        
        mapInstanceRef.current.fitBounds(circle.getBounds());
      }
    }

    return () => {
      if (!isMapModalOpen && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMapModalOpen, profLat, profLng, userRadius]);

  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = () => {
    setAppliedSearch(searchText);
    setAppliedCategories(selectedCategories);
    setAppliedWithinRadius(withinRadius);
    setAppliedSortOrder(sortOrder);
  };

  const handleClear = () => {
    setSearchText("");
    setSelectedCategories([]);
    setWithinRadius(false);
    setAppliedSearch("");
    setAppliedCategories([]);
    setAppliedWithinRadius(false);
    setAppliedSortOrder("newest");
    setSortOrder("newest");
  };

  const handleRemoveSearch = () => {
    setAppliedSearch("");
    setSearchText("");
  };

  const handleRemoveCategory = (cat) => {
    const updated = appliedCategories.filter((c) => c !== cat);
    setAppliedCategories(updated);
    setSelectedCategories(updated);
  };

  const handleRemoveWithinRadius = () => {
    setAppliedWithinRadius(false);
    setWithinRadius(false);
  };

  const filters = {
    search: appliedSearch || undefined,
    categories: appliedCategories.length > 0 ? appliedCategories.join(",") : undefined,
    withinRadius: appliedWithinRadius,
    sort: appliedSortOrder,
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
          withinRadius={withinRadius}
          onWithinRadiusChange={setWithinRadius}
          onApply={handleApply}
          onClear={handleClear}
          userAddress={profLocation}
          onLocationChange={(loc) => {
            if (loc && loc.address) {
              setProfLocation(loc.address);
              if (loc.lat && loc.lng) {
                setProfLat(loc.lat);
                setProfLng(loc.lng);
              }
            }
          }}
          onShowMap={() => setIsMapModalOpen(true)}
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
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setAppliedSortOrder(e.target.value);
                }}
                className="rounded-[6px] border border-[#323232] bg-[#292929] px-3 py-1 text-white text-xs focus:outline-none focus:border-[#F78736] appearance-none"
              >
                <option value="newest">Más nuevo</option>
                <option value="oldest">Más antiguo</option>
                <option value="closest">Más cercano</option>
              </select>
            </div>
          </div>

          {/* Chips de filtros activos */}
          <ActiveChips
            sortLabel={
              appliedSortOrder === "newest" ? "Más nuevo" : 
              appliedSortOrder === "oldest" ? "Más antiguo" : 
              "Más cercano"
            }
            appliedSearch={appliedSearch}
            onRemoveSearch={handleRemoveSearch}
            appliedCategories={appliedCategories}
            onRemoveCategory={handleRemoveCategory}
            appliedWithinRadius={appliedWithinRadius}
            onRemoveWithinRadius={handleRemoveWithinRadius}
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
      
      <Modal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} title="Mi Radio de Trabajo">
        <div className="flex flex-col text-white pb-2">
          <p className="text-sm text-[#A8A8AA] mb-4">
            Ubicación: <span className="text-white font-medium">{profLocation || UBICACION_ACTUAL}</span>
            <br />
            Radio: <span className="text-white font-medium">{userRadius} km</span>
          </p>
          <div className="w-full h-64 bg-[#1e1e1e] rounded-[8px] overflow-hidden border border-[#3f3f3f] relative z-0">
            {profLat && profLng ? (
              <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />
            ) : (
              <div className="flex items-center justify-center h-full text-[#A8A8AA] text-sm">
                No tienes ubicación configurada
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsMapModalOpen(false)}
            className="mt-6 w-full bg-[#323232] text-white py-2.5 rounded-[6px] hover:bg-[#3f3f3f] transition-colors font-medium text-sm"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
}
