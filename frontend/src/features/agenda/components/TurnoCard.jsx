import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import {
  MapPinIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { formatStatus } from "../../../utils/formatters";

export default function TurnoCard({ turno, onVerDetalle }) {
  let formattedFecha = turno.fecha;
  let formattedHorario = turno.horario;

  if (turno.fecha && turno.fecha.includes('T')) {
    const d = new Date(turno.fecha);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    formattedFecha = `${day}/${month}/${year}`;
    formattedHorario = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} hs`;
  }

  return (
    <Card rounded="sm" className="flex flex-col gap-0 border border-[#323232] bg-[#222222] pl-4 pr-4 pt-2.5 pb-2.5  hover:border-[#404040] transition-colors">
      {/* Top Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#888888] tracking-wide mr-1">TURNO <span className="mx-0.5 text-[#555]">•</span></span>
          <span className="inline-flex items-center rounded-[4px] border border-[#3a3a3a] bg-transparent px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
            {formatStatus(turno.estado)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-[4px] border border-[#3a3a3a] bg-transparent px-2 py-0.5 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wider">
            <MapPinIcon className="h-3 w-3" />
            {turno.ubicacion}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#888888]">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>hace 2 días</span>
        </div>
      </div>

      {/* Middle Row */}
      <div className="flex items-center gap-3 pb-3">
        <div className="h-14 w-14 shrink-0 rounded-full bg-[#727272] flex items-center justify-center overflow-hidden">
          {(turno.persona?.foto || turno.cliente?.foto) ? (
            <img src={turno.persona?.foto || turno.cliente?.foto} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <UserIcon className="h-7 w-7 text-white" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-bold text-white leading-tight">{turno.titulo}</h3>
          <span className="text-[13px] text-[#A8A8AA] font-medium">{turno.persona?.nombre || turno.cliente?.nombre}</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#323232]">
        <div className="flex items-center gap-2 text-[#888888] text-[13px]">
          <CalendarDaysIcon className="h-4 w-4" />
          <span>Programado :</span>
          <span className="text-[#E0E0E0] font-medium ml-1">{formattedFecha}</span>
          <span className="text-[#444] mx-1">•</span>
          <span className="text-[#E0E0E0] font-medium">{formattedHorario}</span>
          <span className="text-[#444] mx-1">•</span>
          <span className="inline-flex items-center rounded-[4px] border border-[#3a3a3a] bg-transparent px-2 py-0.5 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wider">
            {turno.categoria}
          </span>
        </div>

        <div>
          <Button variant="ghost" onClick={onVerDetalle} className="border border-[#3a3a3a] text-[13px] font-medium text-white hover:bg-[#3a3a3a] px-4 py-1.5 rounded-[6px] transition-colors h-auto">
            Ver detalle <ArrowRightIcon className="h-3.5 w-3.5 inline-block ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
