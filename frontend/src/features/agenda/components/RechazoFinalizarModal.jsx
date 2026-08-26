import Modal from "../../../components/ui/Modal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function RechazoFinalizarModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center p-4">
        {/* Ícono de Advertencia */}
        <div className="h-16 w-16 bg-[#323232] rounded-full flex items-center justify-center mb-6 mt-4">
          <ExclamationTriangleIcon className="h-8 w-8 text-white" />
        </div>

        {/* Título y Descripción */}
        <h3 className="text-2xl font-bold text-white mb-4 leading-tight max-w-[280px]">
          Confirmación de turno finalizado rechazado
        </h3>
        
        <p className="text-[#A8A8AA] text-base mb-10 max-w-[340px]">
          No fue posible procesar la confirmación de finalización. Por favor, intentalo más tarde.
        </p>

        {/* Botón de Acción */}
        <button 
          onClick={onClose} 
          className="w-full bg-[#323232] text-white font-bold py-4 rounded-[8px] hover:bg-[#404040] transition-colors"
        >
          Volver a Mi agenda
        </button>
      </div>
    </Modal>
  );
}
