import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { UserIcon, MapPinIcon, CalendarDaysIcon, CurrencyDollarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

export default function TurnoDetalleModal({ turno, isOpen, onClose, onConfirmarPago, onReprogramar, onFinalizar }) {
  if (!turno) return null;

  const isPagoPendiente = turno.pago.estado === "PENDIENTE";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col text-[#A8A8AA] w-full max-w-[400px] mx-auto">
        
        {/* Custom Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#323232] mb-6">
          <button
            onClick={onClose}
            className="p-1 text-[#A8A8AA] hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#A8A8AA] border border-[#323232] rounded-[6px] bg-transparent hover:text-white hover:bg-[#323232] transition-colors">
            Cancelar turno
          </button>
        </div>

        {/* Sección 1: Detalle del Turno */}
        <section className="flex flex-col mb-6 border border-[#323232] rounded-[8px] p-4 bg-transparent">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Detalle del Turno</h3>
            <span className="px-2 py-1 text-[10px] font-bold text-[#A8A8AA] bg-[#323232] rounded-[4px] tracking-wider uppercase border border-[#404040]">
              PROGRAMADO
            </span>
          </div>
          
          <div className="border border-[#323232] rounded-[8px] bg-[#292929] flex flex-col">
            {/* Perfil */}
            <div className="flex items-center p-4 gap-4 border-b border-[#323232]">
              <div className="h-12 w-12 rounded-full bg-[#727272] flex items-center justify-center overflow-hidden shrink-0">
                {turno.cliente?.foto ? (
                  <img src={turno.cliente.foto} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">{turno.cliente?.nombre || "Ricardo Gómez"}</span>
                  <div className="flex text-white h-2.5">
                    <StarIcon className="h-2.5 w-2.5" />
                    <StarIcon className="h-2.5 w-2.5" />
                    <StarIcon className="h-2.5 w-2.5" />
                    <StarIcon className="h-2.5 w-2.5" />
                    <StarIcon className="h-2.5 w-2.5 text-[#A8A8AA]" />
                  </div>
                </div>
                <span className="text-[10px] text-[#A8A8AA] uppercase tracking-wide">{turno.cliente?.profesion || "ELECTRICISTA"}</span>
              </div>
            </div>
            
            {/* Fechas */}
            <div className="p-4 border-b border-[#323232]">
              <span className="text-[10px] text-[#A8A8AA] font-bold uppercase tracking-wider block mb-1">FECHA PROPUESTA</span>
              <span className="text-white font-bold text-sm">{turno.fecha || "30/07/2026"}</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-xs text-[#A8A8AA]">Horario</span>
              <span className="text-white font-bold text-sm">{turno.horario || "09:00 hs"}</span>
            </div>
          </div>
        </section>

        {/* Sección 2: Detalle del Cliente */}
        <section className="flex flex-col mb-6 border border-[#323232] rounded-[8px] bg-transparent overflow-hidden">
          {/* Header y Ubicación */}
          <div className="p-4 pb-5 flex flex-col gap-4">
            <h4 className="text-white font-bold flex items-center gap-2 text-base">
              <UserIcon className="h-5 w-5 text-white" />
              Detalle del Cliente
            </h4>
            
            <div className="flex items-start gap-3">
              <div className="bg-[#292929] p-2 rounded-lg shrink-0 border border-[#323232]">
                <MapPinIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#A8A8AA] font-bold uppercase tracking-wider mb-1">UBICACIÓN</span>
                <span className="text-white font-bold text-sm leading-tight mb-1">{turno.direccionExacta || "Av. Santa Fe 2534, Piso 4, Dpto B"}</span>
                <span className="text-xs text-[#A8A8AA] leading-tight">{turno.ubicacion || "Palermo, Ciudad Autónoma de Buenos Aires"}</span>
              </div>
            </div>
          </div>

          {/* Solicitud (Línea Full Width) */}
          <div className="border-t border-[#323232] p-4">
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-1 text-[10px] font-bold text-[#A8A8AA] bg-[#323232] rounded-[4px] uppercase border border-[#404040]">
                PUBLICADA
              </span>
              <span className="px-2 py-1 text-[10px] font-bold text-[#A8A8AA] bg-[#323232] rounded-[4px] uppercase border border-[#404040]">
                PLOMERIA
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-[#A8A8AA] rounded-full shrink-0"></div>
              <div>
                <h5 className="text-white font-bold text-sm mb-1 line-clamp-1">{turno.solicitud?.titulo || "Reparación de pérdida en caño..."}</h5>
                <p className="text-xs leading-relaxed line-clamp-2 text-[#A8A8AA]">
                  {turno.solicitud?.descripcion || "Hay una pérdida constante de agua debajo de la mesada de la cocina. Parece ser el caño..."}
                </p>
              </div>
            </div>
          </div>
          
          {/* Preferencia y Botón (Línea Full Width) */}
          <div className="border-t border-[#323232] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Preferencia: <span className="text-white font-medium">Este mes</span></span>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#323232] rounded-[6px] hover:bg-[#404040] transition-colors border border-[#404040]">
              Ver detalle <span className="text-white">→</span>
            </button>
          </div>
        </section>

        {/* Sección 3: Detalle del Pago */}
        <section className="flex flex-col mb-4 border border-[#323232] rounded-[8px] bg-transparent overflow-hidden">
          {/* Header Pago */}
          <div className="p-4 flex items-center justify-between">
            <h4 className="text-white font-bold flex items-center gap-2 text-base">
              <CurrencyDollarIcon className="h-5 w-5 text-white" />
              Detalle del Pago
            </h4>
            <span className="px-2 py-1 text-[10px] font-bold text-[#A8A8AA] bg-[#323232] rounded-[4px] uppercase border border-[#404040]">
              {turno.pago?.estado || "PENDIENTE"}
            </span>
          </div>

          {/* Filas de pago (Líneas Full Width) */}
          <div className="border-t border-[#323232] p-4 py-3 flex items-center justify-between text-xs">
            <span>Método de Pago</span>
            <span className="text-white">{turno.pago?.metodo || "EFECTIVO"}</span>
          </div>
          <div className="border-t border-[#323232] p-4 py-3 flex items-center justify-between text-xs">
            <span>Seña abonada</span>
            <span className="text-white font-medium">${turno.pago?.senia || "0,00"}</span>
          </div>
          <div className="border-t border-[#323232] p-4 py-3 flex items-center justify-between text-xs">
            <span>Saldo restante</span>
            <span className="text-white font-bold">${turno.pago?.saldo || "45.000,00"}</span>
          </div>
          <div className="border-t border-[#323232] p-4 py-4 flex items-center justify-between text-sm">
            <span className="text-white font-bold">Total del servicio</span>
            <span className="text-white font-bold">${turno.pago?.saldo || "45.000,00"}</span>
          </div>
          
          <div className="px-4 pb-4">
            {isPagoPendiente && (
              <Button variant="primary" onClick={onConfirmarPago} className="font-bold w-full">
                Confirmar pago
              </Button>
            )}
          </div>
        </section>

        {/* Acciones Finales (Fuera de las tarjetas) */}
        <section className="flex items-center gap-3 mt-2">
          <button 
            onClick={onReprogramar} 
            className="flex-1 px-4 py-3 text-xs font-medium text-white border border-[#323232] rounded-[6px] bg-transparent hover:bg-[#292929] transition-colors text-center"
          >
            Reprogramar turno
          </button>
          <button 
            onClick={onFinalizar} 
            disabled={isPagoPendiente}
            className={`flex-1 px-4 py-3 text-xs font-medium rounded-[6px] text-center transition-colors ${
              isPagoPendiente 
                ? 'bg-[#727272] text-[#A8A8AA] opacity-50 cursor-not-allowed' 
                : 'bg-[#F78736] text-white hover:bg-[#e06d00]'
            }`}
          >
            Finalizar turno
          </button>
        </section>
      </div>
    </Modal>
  );
}
