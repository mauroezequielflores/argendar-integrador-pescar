import { useEffect, useState } from "react";
import {
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../context/AuthContext";

function Hourglass() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function SolicitudDetalleModal({ isOpen, onClose, oferta, mode = "solicitud" }) {
  const { user } = useAuth();
  // Animación de entrada y salida
  const [show, setShow] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setCurrentMode(mode);
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mode]);

  if (!isOpen && !show) return null;
  if (!oferta) return null;

  const handleToggleMode = () => {
    setCurrentMode(prev => prev === "solicitud" ? "oferta" : "solicitud");
  };

  const isOfertaMode = currentMode === "oferta";
  const avatarName = isOfertaMode ? (user?.name || user?.first_name || "Profesional") : (oferta.cliente?.nombre || "Cliente");
  
  // Extraer avatar de BD
  let dbAvatarUrl = null;
  if (isOfertaMode) {
    dbAvatarUrl = user?.avatar_url || user?.user_metadata?.avatar_url;
  } else {
    dbAvatarUrl = oferta.cliente?.avatar_url;
  }

  // Verificar si dbAvatarUrl existe y no es null/vacío
  let finalAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=random&color=fff&size=150`;
  
  if (dbAvatarUrl) {
    // Si ya empieza con http, es una url completa (ej. de google OAuth o de supabase public URL completa)
    if (dbAvatarUrl.startsWith('http')) {
      finalAvatarUrl = dbAvatarUrl;
    } else {
      // Si es un path del bucket, intentamos armar la URL. Asumimos el uso de VITE_SUPABASE_URL
      const baseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      if (baseUrl) {
        finalAvatarUrl = `${baseUrl}/storage/v1/object/public/avatars/${dbAvatarUrl}`;
      } else {
        // Fallback en caso de que dbAvatarUrl sea una ruta relativa y no tengamos baseUrl
        finalAvatarUrl = dbAvatarUrl; 
      }
    }
  }

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel Deslizante */}
      <div
        className={`relative z-10 w-full max-w-md h-full bg-[#202020] border-l border-[#323232] shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Cabecera pegajosa */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#323232] px-4 py-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            {isOfertaMode ? "Mi Oferta Enviada" : "Detalle de Solicitud"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#A8A8AA] hover:bg-[#292929] hover:text-white transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">

          {/* Perfil del Cliente / Profesional */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292929] overflow-hidden">
                <img src={finalAvatarUrl} alt="Avatar de perfil" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isOfertaMode 
                    ? (user?.name || user?.first_name ? `${user.first_name || user.name} ${user.last_name || ''}` : "Mi Perfil") 
                    : `${oferta.cliente?.nombre || "Cliente"} ${oferta.cliente?.inicial || ""}`}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#A8A8AA]">{isOfertaMode ? "PROFESIONAL:" : "SOLICITA:"}</span>
                  <span className="rounded bg-[#292929] border border-[#323232] px-2 py-0.5 text-[10px] font-medium text-[#A8A8AA] uppercase">
                    {oferta.servicio || "General"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {currentMode === "solicitud" ? (
            <>
              {/* Título y Descripción */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">{oferta.titulo || "Solicitud"}</h2>
                <p className="mt-3 text-sm text-[#A8A8AA] leading-relaxed">
                  {oferta.descripcion || "Sin descripción detallada."}
                </p>
              </div>

              {/* Estado */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A8A8AA] tracking-wide mb-6">
                <Hourglass />
                ESPERANDO RESPUESTA DEL CLIENTE
              </div>

              {/* Grilla de Detalles Específicos */}
              {oferta.cuestionario && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-3">
                    <p className="text-[10px] text-[#A8A8AA] uppercase tracking-wider mb-1">¿Tiene los materiales?</p>
                    <p className="text-sm font-semibold text-white">{oferta.cuestionario.tieneMateriales ? "SI" : "NO"}</p>
                  </div>
                  <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-3">
                    <p className="text-[10px] text-[#A8A8AA] uppercase tracking-wider mb-1">¿Es una urgencia?</p>
                    <p className="text-sm font-semibold text-white">{oferta.cuestionario.esUrgencia ? "SI" : "NO"}</p>
                  </div>
                  <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-3">
                    <p className="text-[10px] text-[#A8A8AA] uppercase tracking-wider mb-1">Años de antigüedad:</p>
                    <p className="text-sm font-semibold text-white uppercase">{oferta.cuestionario.antiguedad || "No especificado"}</p>
                  </div>
                  <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-3">
                    <p className="text-[10px] text-[#A8A8AA] uppercase tracking-wider mb-1">¿Cuándo lo necesita?</p>
                    <p className="text-sm font-semibold text-white uppercase">{oferta.cuestionario.cuandoLoNecesita || "No especificado"}</p>
                  </div>
                </div>
              )}

              {/* Ubicación y Horario */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#292929] p-2 mt-0.5">
                    <MapPinIcon className="h-4 w-4 text-[#A8A8AA]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#A8A8AA] mb-0.5">Ubicación</p>
                    <p className="text-sm text-white">{oferta.ubicacion || "No especificada"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#292929] p-2 mt-0.5">
                    <ClockIcon className="h-4 w-4 text-[#A8A8AA]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#A8A8AA] mb-0.5">Horario de preferencia</p>
                    <p className="text-sm text-white">{oferta.cuestionario?.horarioPreferencia || "No especificado"}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Información de la oferta */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#F78736]">Tu propuesta</h2>
                <p className="mt-3 text-sm text-[#A8A8AA] leading-relaxed">
                  {oferta.mensajeOferta || "No agregaste un mensaje adicional a esta oferta."}
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-8 border border-[#323232] rounded-[6px] p-4 bg-[#292929]">
                <div className="flex items-center justify-between pb-3 border-b border-[#323232]">
                  <div className="flex items-center gap-2 text-sm text-[#A8A8AA]">
                    <CurrencyDollarIcon className="h-5 w-5" /> Monto total
                  </div>
                  <span className="text-lg font-bold text-white">${oferta.monto ? Number(oferta.monto).toLocaleString("es-AR") : "0"}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-[#323232]">
                  <div className="flex items-center gap-2 text-sm text-[#A8A8AA]">
                    <CalendarIcon className="h-5 w-5" /> Fecha propuesta
                  </div>
                  <span className="text-sm font-semibold text-white">{oferta.fecha || "No especificada"}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm text-[#A8A8AA]">
                    <ClockIcon className="h-5 w-5" /> Horario propuesto
                  </div>
                  <span className="text-sm font-semibold text-white max-w-[150px] text-right break-words">{oferta.hora || "No especificado"}</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Botones Fijos Abajo */}
        <div className="flex flex-col sm:flex-row shrink-0 gap-3 border-t border-[#323232] bg-[#202020] p-6">
          <Button variant="secondary" onClick={handleToggleMode} className="flex-1">
            {currentMode === "solicitud" ? "Ver mi oferta" : "Ver solicitud"}
          </Button>
        </div>
      </div>
    </div>
  );
}
