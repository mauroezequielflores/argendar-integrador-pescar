import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Avatar from "../../../components/ui/Avatar";
import {
  MapPinIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  UserIcon
} from "@heroicons/react/24/outline";

export default function TurnoCard({ turno, onVerDetalle }) {
  return (
    <Card className="p-4 flex flex-col gap-4 border border-[#3a3a3a]">
      {/* Top Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#A8A8AA] tracking-wider">TURNO •</span>
          <Badge variant={turno.estado === "CONFIRMADO" ? "orange" : "default"} className="uppercase">
            {turno.estado}
          </Badge>
          <Badge className="flex items-center gap-1 uppercase">
            <MapPinIcon className="h-3 w-3" />
            {turno.ubicacion}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#A8A8AA]">
          <ClockIcon className="h-3 w-3" />
          <span>hace 2 días</span>
        </div>
      </div>

      {/* Middle Row */}
      <div className="flex items-center gap-4 py-2 border-b border-[#3a3a3a]">
        <div className="h-12 w-12 rounded-full bg-[#727272] flex items-center justify-center overflow-hidden">
          {turno.cliente?.foto ? (
             <img src={turno.cliente.foto} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <UserIcon className="h-6 w-6 text-white" />
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-white">{turno.titulo}</h3>
          <span className="text-sm text-[#A8A8AA]">{turno.cliente?.nombre}</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 text-[#A8A8AA] text-sm">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Programado :</span>
            <span className="text-white font-medium">{turno.fecha} • {turno.horario}</span>
          </div>
          <span className="text-[#3a3a3a]">•</span>
          <Badge className="uppercase">{turno.categoria}</Badge>
        </div>

        <div>
          <Button variant="ghost" onClick={onVerDetalle} className="border-[#3a3a3a] text-white hover:border-[#F78736]">
            Ver detalle <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
