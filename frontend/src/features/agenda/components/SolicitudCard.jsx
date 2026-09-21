import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import {
  MapPinIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

export default function SolicitudCard({ solicitud, onVerDetalle, onVerOfertas }) {
  return (
    <Card className="p-4 flex flex-col gap-4 border border-[#3a3a3a]">
      {/* Top Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#A8A8AA] tracking-wider">SOLICITUD •</span>
          <Badge variant={solicitud.status === "open" ? "orange" : "default"} className="uppercase">
            {solicitud.status}
          </Badge>
          <Badge className="flex items-center gap-1 uppercase">
            <MapPinIcon className="h-3 w-3" />
            {solicitud.neighborhood || solicitud.city || "Ubicación"}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#A8A8AA]">
          <ClockIcon className="h-3 w-3" />
          <span>
            {new Date(solicitud.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Middle Row */}
      <div className="flex items-center gap-4 py-2 border-b border-[#3a3a3a]">
        <div className="h-12 w-12 rounded-full bg-[#727272] flex items-center justify-center overflow-hidden">
          <DocumentTextIcon className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-white">{solicitud.title}</h3>
          <span className="text-sm text-[#A8A8AA] line-clamp-1">{solicitud.description}</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 text-[#A8A8AA] text-sm">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Preferencia :</span>
            <span className="text-white font-medium">{solicitud.date_preference}</span>
          </div>
          <span className="text-[#3a3a3a]">•</span>
          <Badge className="uppercase">{solicitud.category?.name || "Sin Categoría"}</Badge>
        </div>

        <div className="flex items-center gap-2">
          {solicitud.offers && solicitud.offers.length > 0 && (
            <Button 
              variant="primary" 
              onClick={onVerOfertas} 
              className="bg-[#F78736] hover:bg-[#E0722D] text-white"
            >
              Ver ofertas ({solicitud.offers.length})
            </Button>
          )}
          <Button variant="ghost" onClick={onVerDetalle} className="border-[#3a3a3a] text-white hover:border-[#F78736]">
            Ver detalle <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
