import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { UserIcon, MapPinIcon, CalendarDaysIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function TurnoDetalleModal({ turno, isOpen, onClose, onConfirmarPago, onReprogramar, onFinalizar }) {
  if (!turno) return null;

  const isPagoPendiente = turno.pago.estado === "PENDIENTE";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle del Turno">
      <div className="flex flex-col gap-6 text-[#A8A8AA]">
        
        {/* Detalle del Turno */}
        <section className="flex flex-col gap-3">
          <h4 className="text-white font-medium">Estado y Horario</h4>
          <div className="flex items-center gap-3">
            <Badge variant={turno.estado === "CONFIRMADO" ? "orange" : "default"}>{turno.estado}</Badge>
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-5 w-5" />
              <span>{turno.fecha} • {turno.horario}</span>
            </div>
          </div>
        </section>

        {/* Detalle del Cliente y Solicitud */}
        <section className="flex flex-col gap-3 border-t border-[#3a3a3a] pt-4">
          <h4 className="text-white font-medium">Cliente</h4>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#727272] flex items-center justify-center overflow-hidden">
              {turno.cliente?.foto ? (
                <img src={turno.cliente.foto} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-medium">{turno.cliente?.nombre}</span>
              <span className="text-xs">Calificación: ⭐ {turno.cliente?.calificacion}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 mt-2">
            <MapPinIcon className="h-5 w-5 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-white">{turno.direccionExacta}</span>
              <span className="text-sm">{turno.ubicacion}</span>
            </div>
          </div>

          <div className="bg-[#292929] rounded-md p-3 mt-2">
            <h5 className="text-white font-medium mb-1">Solicitud original: {turno.solicitud?.titulo}</h5>
            <p className="text-sm">{turno.solicitud?.descripcion}</p>
          </div>
        </section>

        {/* Detalle del Pago */}
        <section className="flex flex-col gap-3 border-t border-[#3a3a3a] pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium flex items-center gap-2">
              <CurrencyDollarIcon className="h-5 w-5" />
              Detalle del Pago
            </h4>
            <Badge variant={isPagoPendiente ? "warning" : "success"}>
              {turno.pago.estado}
            </Badge>
          </div>
          
          <div className="flex flex-col gap-1 text-sm bg-[#292929] rounded-md p-3">
            <div className="flex justify-between">
              <span>Método:</span>
              <span className="text-white">{turno.pago.metodo}</span>
            </div>
            <div className="flex justify-between">
              <span>Seña abonada:</span>
              <span className="text-white">${turno.pago.senia}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-[#3a3a3a] mt-1">
              <span>Total a cobrar:</span>
              <span className="text-white">${turno.pago.saldo}</span>
            </div>
          </div>

          {isPagoPendiente && (
            <Button variant="primary" onClick={onConfirmarPago} className="mt-2">
              Confirmar cobro
            </Button>
          )}
        </section>

        {/* Acciones Finales */}
        <section className="flex flex-col gap-3 border-t border-[#3a3a3a] pt-6 mt-2">
          <div className="flex gap-4">
            <Button variant="secondary" onClick={onReprogramar}>
              Reprogramar turno
            </Button>
            <Button 
              variant="primary" 
              onClick={onFinalizar} 
              disabled={isPagoPendiente}
            >
              Finalizar turno
            </Button>
          </div>
        </section>
      </div>
    </Modal>
  );
}
