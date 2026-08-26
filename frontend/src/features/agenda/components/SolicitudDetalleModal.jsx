import { useEffect, useState } from "react";
import {
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  //HourglassIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import Button from "../../../components/ui/Button";

// Mock Hourglass (since it's not in outline sometimes, let's use a generic one if needed or we use a standard div)
function Hourglass() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function SolicitudDetalleModal({ isOpen, onClose, oferta }) {
  // Animación de entrada y salida
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen && !show) return null;

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
        <div className="flex shrink-0 items-center border-b border-[#323232] px-4 py-4">
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#A8A8AA] hover:bg-[#292929] hover:text-white transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">

          {/* Perfil del Cliente */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#202020]">
                {/* Asumimos un Avatar blanco como en la captura */}
                <UserIcon className="h-6 w-6 text-[#202020]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Alejandra Martínez</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#A8A8AA]">SOLICITA:</span>
                  <span className="rounded bg-[#292929] border border-[#323232] px-2 py-0.5 text-[10px] font-medium text-[#A8A8AA]">
                    PLOMERIA
                  </span>
                </div>
              </div>
            </div>
            <a href="#" className="flex items-center gap-1 text-xs text-[#A8A8AA] hover:text-white transition-colors">
              Ir a perfil <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Título y Descripción */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Reparación de pérdida en caño principal</h2>
            <p className="mt-3 text-sm text-[#A8A8AA] leading-relaxed">
              Hay una pérdida constante de agua debajo de la mesada de la cocina. El agua se filtra por el mueble y está empezando a dañar la madera. Parece ser el caño principal que conecta con la red del edificio. Necesito un profesional con herramientas para soldar termofusión si fuera necesario.
            </p>
          </div>

          {/* Estado */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A8A8AA] tracking-wide mb-6">
            <Hourglass />
            ESPERANDO OFERTAS...
          </div>

          {/* Grilla de Detalles Específicos */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-3">
              <p className="text-[10px] text-[#A8A8AA] uppercase tracking-wider mb-1">¿Tiene los materiales?</p>
              <p className="text-sm font-semibold text-white">NO</p>
            </div>
            <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-3">
              <p className="text-[10px] text-[#A8A8AA] uppercase tracking-wider mb-1">¿Es una urgencia?</p>
              <p className="text-sm font-semibold text-white">SI</p>
            </div>
            <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-3">
              <p className="text-[10px] text-[#A8A8AA] uppercase tracking-wider mb-1">Años de antigüedad:</p>
              <p className="text-sm font-semibold text-white">NO ESTOY SEGURO</p>
            </div>
            <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-3">
              <p className="text-[10px] text-[#A8A8AA] uppercase tracking-wider mb-1">¿Cuándo lo necesita?</p>
              <p className="text-sm font-semibold text-white">Lo antes posible</p>
            </div>
          </div>

          {/* Ubicación y Horario */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#292929] p-2 mt-0.5">
                <MapPinIcon className="h-4 w-4 text-[#A8A8AA]" />
              </div>
              <div>
                <p className="text-[10px] text-[#A8A8AA] mb-0.5">Ubicación</p>
                <p className="text-sm text-white">Palermo, CABA <span className="text-[#A8A8AA]">(A 2.5 km de tu ubicación)</span></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#292929] p-2 mt-0.5">
                <ClockIcon className="h-4 w-4 text-[#A8A8AA]" />
              </div>
              <div>
                <p className="text-[10px] text-[#A8A8AA] mb-0.5">Horario de preferencia</p>
                <p className="text-sm text-white">Mañana (08:00 - 12:00) o Tarde (14:00 - 18:00)</p>
              </div>
            </div>
          </div>

          {/* Fotos del Problema */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Fotos del problema</h4>
            <div className="flex flex-col gap-2">
              {/* Foto principal */}
              <div className="w-full h-48 rounded-[6px] bg-[#292929] overflow-hidden">
                <img
                  src="https://placehold.co/600x400/292929/A8A8AA?text=Foto+Principal"
                  alt="Problema principal"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Miniaturas */}
              <div className="grid grid-cols-4 gap-2">
                <div className="aspect-square rounded-[6px] border-2 border-[#F78736] overflow-hidden">
                  <img src="https://placehold.co/150x150/292929/A8A8AA?text=1" alt="thumb" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-[6px] bg-[#292929] overflow-hidden opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src="https://placehold.co/150x150/292929/A8A8AA?text=2" alt="thumb" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-[6px] bg-[#292929] overflow-hidden opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src="https://placehold.co/150x150/292929/A8A8AA?text=3" alt="thumb" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-[6px] bg-[#292929] flex items-center justify-center text-sm font-semibold text-[#A8A8AA] cursor-pointer hover:bg-[#323232] transition-colors">
                  +2
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Botones Fijos Abajo */}
        <div className="flex shrink-0 gap-3 border-t border-[#323232] bg-[#202020] p-6">
          <Button variant="secondary" onClick={() => console.log('Cancelar oferta')} className="flex-1">
            Cancelar oferta
          </Button>
          <Button variant="primary" onClick={() => console.log('Ver mi oferta')} className="flex-1">
            Ver mi oferta
          </Button>
        </div>
      </div>
    </div>
  );
}
