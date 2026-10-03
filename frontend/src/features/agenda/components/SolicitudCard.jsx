import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import {
  MapPinIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { formatDatePreference, getSupabasePublicUrl } from "../../../utils/formatters";

import { useAuth } from "../../../context/AuthContext";

export default function SolicitudCard({ solicitud, onVerDetalle, onVerOfertas }) {
  const { user } = useAuth();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-[#F78736] border-[#F78736]/30 bg-[#F78736]/10';
      case 'assigned': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'completed': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'cancelled': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-white border-[#3a3a3a]';
    }
  };

  return (
    <Card rounded="sm" className="flex flex-col gap-0 border border-[#323232] bg-[#222222] p-5 hover:border-[#404040] transition-colors">
      {/* Top Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#888888] tracking-wide mr-1">SOLICITUD <span className="mx-0.5 text-[#555]">•</span></span>
          <span className={`inline-flex items-center rounded-[4px] border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(solicitud.status)}`}>
            {solicitud.status === 'open' ? 'ABIERTA' : solicitud.status}
          </span>
          <span className="inline-flex items-center gap-1 rounded-[4px] border border-[#3a3a3a] bg-transparent px-2 py-0.5 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wider">
            <MapPinIcon className="h-3 w-3" />
            {solicitud.neighborhood || solicitud.city || "Ubicación"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#888888]">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{new Date(solicitud.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Middle Row */}
      <div className="flex items-center gap-4 pb-5 pt-1">
        <div className="h-14 w-14 shrink-0 rounded-full bg-[#323232] flex items-center justify-center overflow-hidden border border-[#404040]">
          {user?.avatar_url ? (
            <img src={getSupabasePublicUrl(user.avatar_url, 'avatars')} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <UserIcon className="h-7 w-7 text-[#A8A8AA]" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-bold text-white leading-tight">{solicitud.title}</h3>
          <span className="text-[13px] text-[#A8A8AA] font-medium line-clamp-1">{solicitud.description}</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#323232]">
        <div className="flex items-center gap-2 text-[#888888] text-[13px]">
          <CalendarDaysIcon className="h-4 w-4" />
          <span>Preferencia :</span>
          <span className="text-[#E0E0E0] font-medium ml-1">{formatDatePreference(solicitud.date_preference)}</span>
          <span className="text-[#444] mx-1">•</span>
          <span className="inline-flex items-center rounded-[4px] border border-[#3a3a3a] bg-transparent px-2 py-0.5 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wider">
            {solicitud.category?.name || "Sin Categoría"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {solicitud.offers && solicitud.offers.length > 0 && (
            <Button 
              variant="primary" 
              onClick={onVerOfertas} 
              className="bg-[#F78736] hover:bg-[#E0722D] text-white text-[13px] font-medium px-4 py-1.5 rounded-[6px] h-auto"
            >
              Ver ofertas ({solicitud.offers.length})
            </Button>
          )}
          <Button variant="ghost" onClick={onVerDetalle} className="border border-[#3a3a3a] text-[13px] font-medium text-white hover:bg-[#3a3a3a] px-4 py-1.5 rounded-[6px] transition-colors h-auto">
            Ver detalle <ArrowRightIcon className="h-3.5 w-3.5 inline-block ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
