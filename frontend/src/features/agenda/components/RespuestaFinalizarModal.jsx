import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function RespuestaFinalizarModal({ isOpen, isSuccess, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
        {isSuccess ? (
          <>
            <div className="rounded-full bg-green-500/20 p-4">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Confirmación de turno finalizado exitosamente</h3>
            <p className="text-[#A8A8AA]">
              Tu Turno se confirmó como finalizado. Ahora el cliente puede proceder con su reseña.
            </p>
            <Button variant="primary" onClick={onClose} className="mt-4">
              Ir a mis reseñas -&gt;
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-full bg-red-500/20 p-4">
              <ExclamationCircleIcon className="h-16 w-16 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Confirmación de turno finalizado rechazado</h3>
            <p className="text-[#A8A8AA]">
              No fue posible procesar la confirmación por inconsistencia en el pago o error del sistema.
            </p>
            <Button variant="secondary" onClick={onClose} className="mt-4">
              Volver a Mi agenda
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
