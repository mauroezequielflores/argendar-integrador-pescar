import Modal from "../../../components/ui/Modal";
import { CheckIcon } from "@heroicons/react/24/solid";

export default function ExitoPagoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center text-center p-4">
        {/* Ícono de Check */}
        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-6 mt-4">
          <CheckIcon className="h-8 w-8 text-[#202020] font-bold stroke-[3]" />
        </div>

        {/* Título y Descripción */}
        <h3 className="text-2xl font-bold text-white mb-4 leading-tight max-w-[320px]">
          Confirmación de pago exitosa
        </h3>
        
        <p className="text-[#A8A8AA] text-base mb-10 max-w-[380px]">
          El pago se ha registrado correctamente en nuestro sistema. Ahora puedes finalizar el turno.
        </p>

        {/* Botón de Acción */}
        <button 
          onClick={onClose} 
          className="w-full bg-[#F78736] text-white font-bold py-4 rounded-[8px] hover:bg-[#e06d00] transition-colors flex items-center justify-center gap-2"
        >
          Continuar <span>→</span>
        </button>
      </div>
    </Modal>
  );
}
