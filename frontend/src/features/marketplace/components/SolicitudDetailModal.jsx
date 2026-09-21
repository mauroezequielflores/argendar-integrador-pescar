import { useNavigate } from "react-router-dom";
import { useRequestDetail } from "../hooks/useMarketplaceQueries";
import Modal from "../../../components/ui/Modal";
import Loader from "../../../components/ui/Loader";
import { MapPinIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";

export default function SolicitudDetailModal({ isOpen, onClose, solicitudId }) {
  const navigate = useNavigate();

  const { data: resultData, isLoading, isError } = useRequestDetail(isOpen ? solicitudId : null);

  const detail = resultData?.data;

  const handleCreateOffer = () => {
    navigate(`/professional/marketplace/${solicitudId}/create-offer`);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de la solicitud">
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader />
        </div>
      ) : isError || !detail ? (
        <div className="text-red-400 p-8 text-center bg-[#292929] rounded-[6px]">
          Ocurrió un error al cargar los detalles.
        </div>
      ) : (
        <div className="flex flex-col gap-6 text-white pb-2">
          {/* Header con Avatar */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#323232] flex items-center justify-center text-[#A8A8AA]">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-[#A8A8AA]">SOLICITA:</p>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold">{detail.cliente.nombre} {detail.cliente.inicial}</p>
                <span className="rounded-full bg-[#323232] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#F78736] uppercase">
                  {detail.categoria}
                </span>
              </div>
            </div>
          </div>

          {/* Título y Descripción */}
          <div>
            <h4 className="text-lg font-bold mb-2">{detail.titulo}</h4>
            <p className="text-sm text-[#A8A8AA] leading-relaxed whitespace-pre-line">
              {detail.descripcion}
            </p>
          </div>

          {/* Grilla de Cuestionario */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#323232] rounded-[6px] p-3 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wide">¿TIENE LOS MATERIALES?</span>
              <span className="text-sm font-semibold">{detail.cuestionario.tieneMateriales ? 'SI' : 'NO'}</span>
            </div>
            <div className="bg-[#323232] rounded-[6px] p-3 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wide">¿ES UNA URGENCIA?</span>
              <span className="text-sm font-semibold">{detail.cuestionario.esUrgencia ? 'SI' : 'NO'}</span>
            </div>
            <div className="bg-[#323232] rounded-[6px] p-3 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wide">AÑOS DE ANTIGÜEDAD</span>
              <span className="text-sm font-semibold">{detail.cuestionario.antiguedad || 'NO ESTOY SEGURO'}</span>
            </div>
            <div className="bg-[#323232] rounded-[6px] p-3 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wide">¿CUÁNDO LO NECESITA?</span>
              <span className="text-sm font-semibold capitalize">{detail.cuestionario.cuandoLoNecesita?.replace(/_/g, ' ') || 'Soy flexible'}</span>
            </div>
          </div>

          {/* Ubicación y Horario */}
          <div className="flex flex-col gap-2 border-t border-b border-[#323232] py-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#323232] rounded-full p-1.5 text-[#A8A8AA]">
                <MapPinIcon className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">{detail.ubicacion}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#323232] rounded-full p-1.5 text-[#A8A8AA]">
                <ClockIcon className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Horario de preferencia: {detail.horarioPreferencia || 'Indistinto'}</p>
            </div>
          </div>

          {/* Fotos (Si las hay) */}
          {detail.imagenesUrl && detail.imagenesUrl.length > 0 && (
            <div>
              <p className="text-xs text-[#A8A8AA] font-bold mb-2 uppercase">Fotos adjuntas</p>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {detail.imagenesUrl.map((url, i) => (
                  <div key={i} className="h-20 w-24 shrink-0 rounded-[6px] bg-[#323232] overflow-hidden border border-[#292929]">
                    <img src={url} alt="Problema" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex items-center justify-between gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-[#323232] text-[#A8A8AA] font-semibold py-3 rounded-[6px] transition-colors hover:bg-[#3f3f3f]"
            >
              Cancelar oferta
            </button>
            <button
              onClick={handleCreateOffer}
              className="flex-1 bg-[#F78736] text-white font-semibold py-3 rounded-[6px] transition-colors hover:bg-orange-500"
            >
              Crear una Oferta
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
