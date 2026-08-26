import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Button from "../../../components/ui/Button";

export default function OfertaCard({ oferta, onVerDetalle, onVerMiOferta }) {
  // En un caso real, la data vendría de la prop "oferta".
  // Usamos los valores fijos del diseño por ahora.
  
  return (
    <div className="relative overflow-hidden rounded-[6px] border border-[#323232] bg-[#292929]">
      {/* Etiqueta superior derecha "OFERTA ENVIADA" */}
      <div className="absolute right-0 top-0 rounded-bl-[6px] bg-[#F78736] px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
        Oferta Enviada
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        {/* Superior: Tags y tiempo */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#A8A8AA]">
            <span>SOLICITUD</span>
            <span className="text-[#323232]">·</span>
            <span className="rounded border border-[#323232] px-2.5 py-1 text-white">
              CON OFERTAS
            </span>
            <span className="flex items-center gap-1 rounded border border-[#323232] px-2.5 py-1 text-white">
              <MapPinIcon className="h-3.5 w-3.5 text-[#A8A8AA]" />
              Caballito, CABA
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#A8A8AA] sm:pr-32">
            <ClockIcon className="h-4 w-4" />
            Publicado hace 1 día
          </div>
        </div>

        {/* Medio: Avatar, Titulo, Desc */}
        <div className="mt-2 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#727272] text-white">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Cambio de tablero principal</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#A8A8AA]">
              Reemplazo de tablero eléctrico antiguo por uno nuevo con disyuntor y térmicas sectorizadas. Departamento de 3 ambientes.
            </p>
          </div>
        </div>

        {/* Divisor */}
        <hr className="mt-2 border-[#323232]" />

        {/* Inferior: Preferencia, Categoria, Ofertas, Botones */}
        <div className="pt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#A8A8AA]">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              Preferencia: <span className="font-semibold text-white">Soy flexible</span>
            </div>
            <span className="text-[#323232]">·</span>
            <span className="rounded border border-[#323232] px-2.5 py-1">ELECTRICIDAD</span>
            <span className="text-[#323232]">·</span>
            <span className="rounded border border-[#323232] px-2.5 py-1">3 Ofertas recibidas</span>
          </div>
          
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Button 
              variant="ghost" 
              onClick={onVerDetalle} 
              className="flex-1 gap-2 border-[#323232] !text-white hover:border-[#A8A8AA] sm:flex-none"
            >
              Ver detalle <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="primary" 
              onClick={onVerMiOferta} 
              className="flex-1 sm:flex-none"
            >
              Ver mi oferta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
