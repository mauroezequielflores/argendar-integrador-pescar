import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon, ArrowRightIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { getSupabasePublicUrl } from "../../../utils/formatters";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

function timeSince(fechaISO) {
  if (!fechaISO) return "hace poco";
  const date = new Date(fechaISO);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `hace ${interval} año${interval === 1 ? '' : 's'}`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `hace ${interval} mes${interval === 1 ? '' : 'es'}`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `hace ${interval} día${interval === 1 ? '' : 's'}`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `hace ${interval} hora${interval === 1 ? '' : 's'}`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `hace ${interval} minuto${interval === 1 ? '' : 's'}`;
  return "hace unos segundos";
}

export default function OfertaCard({ oferta, onVerDetalle, onVerMiOferta }) {
  let formattedFecha = oferta?.fecha || '';
  let formattedHorario = oferta?.hora || '';
  
  if (formattedFecha && formattedFecha.includes('-')) {
    const [year, month, day] = formattedFecha.split("-");
    formattedFecha = `${day}/${month}/${year}`;
  }

  return (
    <Card rounded="sm" className="relative flex flex-col gap-0 border border-[#323232] bg-[#222222] p-5 hover:border-[#404040] transition-colors overflow-hidden">
      {/* Etiqueta superior derecha "OFERTA ENVIADA" y Reloj */}
      <div className="absolute right-0 top-0 flex items-center overflow-hidden rounded-bl-[6px] border-b border-l border-[#323232] bg-[#222222]">
        <div className="flex items-center gap-1 px-3 text-[11px] text-[#888888]">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{timeSince(oferta?.fechaPublicacion)}</span>
        </div>
        <div className="bg-[#F78736] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Oferta Enviada
        </div>
      </div>

      {/* Top Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-[#888888] tracking-wide mr-1">OFERTA <span className="mx-0.5 text-[#555]">•</span></span>
          <span className="inline-flex items-center gap-1 rounded-[4px] border border-[#3a3a3a] bg-transparent px-2 py-0.5 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wider">
            <MapPinIcon className="h-3 w-3" />
            {oferta?.ubicacion || "Ubicación no especificada"}
          </span>
        </div>
      </div>

      {/* Middle Row */}
      <div className="flex items-center gap-4 pb-5 pt-1">
        <div className="h-14 w-14 shrink-0 rounded-full bg-[#727272] flex items-center justify-center overflow-hidden text-white">
          {oferta?.cliente?.avatar_url ? (
             <img src={getSupabasePublicUrl(oferta.cliente.avatar_url, 'avatars')} alt="avatar" className="h-full w-full object-cover" />
          ) : oferta?.cliente?.inicial ? (
            <span className="text-xl font-bold">{oferta.cliente.nombre.charAt(0)}{oferta.cliente.inicial.charAt(0)}</span>
          ) : (
            <UserIcon className="h-7 w-7" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-bold text-white leading-tight">{oferta?.titulo || "Solicitud"}</h3>
          <span className="text-[13px] text-[#A8A8AA] font-medium">{oferta?.cliente?.nombre || "Cliente"} {oferta?.cliente?.apellido || ""}</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#323232]">
        <div className="flex items-center gap-2 text-[#888888] text-[13px] flex-wrap">
          <CalendarDaysIcon className="h-4 w-4" />
          <span>Propuesto :</span>
          <span className="text-[#E0E0E0] font-medium ml-1">{formattedFecha}</span>
          <span className="text-[#444] mx-1">•</span>
          <span className="text-[#E0E0E0] font-medium">{formattedHorario} hs</span>
          <span className="text-[#444] mx-1">•</span>
          <span className="inline-flex items-center rounded-[4px] border border-[#3a3a3a] bg-transparent px-2 py-0.5 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wider">
            {oferta?.servicio?.toUpperCase() || "GENERAL"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onVerDetalle} 
            className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#3a3a3a] bg-transparent px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#3a3a3a] active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            Ver solicitud
          </button>
          <button 
            type="button"
            onClick={onVerMiOferta} 
            className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#F78736] bg-[#F78736] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#e06d00] hover:border-[#e06d00] active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            Ver mi oferta <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
