import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Crear un ícono custom usando SVG (Soluciona el problema de rutas rotas de Vite y se ve más moderno)
const customIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F78736" class="w-8 h-8 -mt-8 -ml-4" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.5));">
          <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
         </svg>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

/**
 * AddressAutocomplete — Buscador de direcciones usando USIG (Normalizador de Direcciones v2.1.2)
 * 
 * @param {Function} onAddressSelect - Callback disparado al seleccionar una dirección. Recibe { address, lat, lng }
 * @param {String} defaultValue - Valor inicial del input (opcional)
 * @param {String} error - Mensaje de error para mostrar (opcional)
 * @param {Boolean} showMap - Si es true, muestra un pequeño mapa debajo con la ubicación seleccionada
 */
export default function AddressAutocomplete({
  onAddressSelect,
  defaultValue = "",
  error,
  showMap = true,
  label = "Dirección"
}) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejo del mapa puro de Leaflet para evitar bugs de StrictMode y HMR
  useEffect(() => {
    if (!showMap || !selectedCoords || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Inicializar el mapa con zoom nivel 17 (más cerca)
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false, // Opcional: previene que lo arrastren si es solo preview
      }).setView(selectedCoords, 17);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Agregar marcador con Tooltip moderno
      const marker = L.marker(selectedCoords, { icon: customIcon }).addTo(map);
      marker.bindTooltip(
        `<div class='font-medium text-xs text-gray-800'>${query}</div>`,
        { permanent: true, direction: "top", offset: [0, -32], className: 'shadow-md rounded-md' }
      ).openTooltip();

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;

      // Observer para corregir el bug de renderizado parcial (gray map) 
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);

      // Limpiar observer internamente
      map.on('unload', () => {
        resizeObserver.disconnect();
      });
    } else {
      // Si ya existe, solo movemos el centro, actualizamos marcador y mantenemos el zoom 17
      mapInstanceRef.current.setView(selectedCoords, 17);
      markerInstanceRef.current.setLatLng(selectedCoords);
      // Actualizamos el texto del tooltip
      if (markerInstanceRef.current.getTooltip()) {
        markerInstanceRef.current.setTooltipContent(`<div class='font-medium text-xs text-gray-800'>${query}</div>`);
      }
    }
  }, [showMap, selectedCoords, query]);

  // Cleanup de desmontaje total
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const searchAddress = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 4) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${encodeURIComponent(searchTerm)}&geocodificar=true`);
      setResults(res.data.direccionesNormalizadas || []);
    } catch (err) {
      console.error("Error al buscar dirección en USIG API:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (selectedCoords) {
      setSelectedCoords(null);
      if (onAddressSelect) {
        onAddressSelect({ address: value, lat: null, lng: null });
      }
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAddress(value);
    }, 500);
  };

  const handleSelect = (item) => {
    const address = item.direccion;
    const lat = item.coordenadas && item.coordenadas.y ? parseFloat(item.coordenadas.y) : null;
    const lng = item.coordenadas && item.coordenadas.x ? parseFloat(item.coordenadas.x) : null;
    const city = item.nombre_partido || "";
    const neighborhood = item.nombre_localidad || "";

    setQuery(address);
    if (lat && lng) {
      setSelectedCoords([lat, lng]);
    }
    setIsOpen(false);

    if (onAddressSelect) {
      onAddressSelect({ address, lat, lng, city, neighborhood });
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full" ref={wrapperRef}>
      {label && (
        <label className="text-xs font-medium text-white">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (query.length > 3) setIsOpen(true) }}
          placeholder="Ej: Corrientes Av. 1234, CABA"
          className={`
            w-full rounded-[6px] border bg-transparent py-2.5 text-sm text-white placeholder-[#A8A8AA]
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F78736] focus:ring-offset-0
            pl-10 pr-3
            ${error ? "border-red-500 focus:ring-red-500" : "border-[#3a3a3a] hover:border-[#555] focus:border-[#F78736]"}
          `}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A8AA] flex items-center justify-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </div>

        {isOpen && (results.length > 0 || loading) && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-[#3f3f3f] bg-[#292929] shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-3 text-sm text-[#A8A8AA]">Buscando...</div>
            ) : (
              <ul className="py-1">
                {results.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelect(item)}
                    className="cursor-pointer px-4 py-2 hover:bg-[#3f3f3f] flex flex-col"
                  >
                    <span className="text-sm font-medium text-white">{item.direccion}</span>
                    <span className="text-xs text-[#A8A8AA] truncate">{item.nombre_partido || item.nombre_localidad}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

      {/* Contenedor estático para Leaflet puro */}
      <div
        className={`mt-3 w-full rounded-md overflow-hidden border border-[#3f3f3f] relative z-0 transition-all duration-300 ${showMap && selectedCoords ? "h-48 opacity-100" : "h-0 opacity-0 border-none"
          }`}
      >
        <div
          ref={mapContainerRef}
          className="absolute inset-0 h-full w-full bg-[#1e1e1e]"
        />
      </div>
    </div>
  );
}
