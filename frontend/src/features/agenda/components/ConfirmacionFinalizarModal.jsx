import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function ConfirmacionFinalizarModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Finalizar Turno">
      <div className="flex flex-col gap-6 text-[#A8A8AA]">
        <p>
          ¿Estás seguro que deseas finalizar este turno? Una vez confirmes su finalización será movido a tu historial como turno finalizado.
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="ghost" onClick={onClose} className="w-auto">
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm} className="w-auto">
            Finalizar turno
          </Button>
        </div>
      </div>
    </Modal>
  );
}
