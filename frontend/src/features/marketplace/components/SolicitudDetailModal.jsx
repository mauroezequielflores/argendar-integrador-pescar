import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestDetail } from "../hooks/useMarketplaceQueries";
import Modal from "../../../components/ui/Modal";
import Loader from "../../../components/ui/Loader";
import { MapPinIcon, ClockIcon, UserIcon, WrenchScrewdriverIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { formatDatePreference, getSupabasePublicUrl } from "../../../utils/formatters";
import ImagePreviewModal from "../../../components/ui/ImagePreviewModal";

export default function SolicitudDetailModal({ isOpen, onClose, solicitudId, preloadedData, readOnly = false }) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: resultData, isLoading, isError } = useRequestDetail(
    isOpen && !preloadedData ? solicitudId : null
  );

  const detail = preloadedData || resultData?.data;

  const handleCreateOffer = () => {
    navigate(`/professional/marketplace/${solicitudId}/create-offer`);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={null}>
      {isLoading && !preloadedData ? (
        <div className="flex justify-center p-8">
          <Loader />
        </div>
      ) : (isError && !preloadedData) || !detail ? (
        <div className="text-red-400 p-8 text-center bg-[#292929] rounded-[6px]">
          Ocurrió un error al cargar los detalles.
        </div>
      ) : (
        <div className="flex flex-col gap-6 text-white pb-2 px-2 mt-2">
          {/* Botón Cerrar (Top Left) */}
          <div className="flex justify-start border-b border-[#292929] pb-4">
            <button
              onClick={onClose}
              className="text-[#A8A8AA] hover:text-white transition-colors"
            >
              <XMarkIcon className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Información del Cliente y Categoría */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#323232] flex items-center justify-center overflow-hidden border border-[#404040] shrink-0">
              {detail.cliente.foto ? (
                <img src={getSupabasePublicUrl(detail.cliente.foto, 'avatars')} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-6 w-6 text-[#A8A8AA]" />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-[#A8A8AA] font-bold uppercase tracking-wide leading-none">Solicita</span>
              <p className="text-base font-bold text-white leading-none">{detail.cliente.nombre} {detail.cliente.inicial}</p>
              <div className="flex items-center gap-1.5 text-[#A8A8AA] font-bold tracking-wider text-[11px] mt-0.5">
                 <WrenchScrewdriverIcon className="h-3.5 w-3.5" />
                 <span className="uppercase">{detail.categoria}</span>
              </div>
            </div>
          </div>

          {/* Estado de la Solicitud */}
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wide border-b border-[#292929] pb-4 mt-1">
            <span className="text-[#A8A8AA] uppercase">SOLICITUD •</span>
            <span className="bg-[#323232] text-white px-2 py-0.5 rounded-[4px] uppercase border border-[#404040]">
              PUBLICADA
            </span>
            <span className="text-[#A8A8AA] ml-2">⏳ Esperando ofertas...</span>
          </div>

          {/* Título y Descripción */}
          <div className="mt-2">
            <h4 className="text-xl font-bold mb-2 text-white leading-tight">{detail.titulo}</h4>
            <p className="text-[13.5px] text-[#A8A8AA] leading-relaxed whitespace-pre-line mb-4">
              {detail.descripcion?.includes('Detalles:') 
                ? detail.descripcion.split('Detalles:')[0].trim() 
                : detail.descripcion}
            </p>
            {detail.descripcion?.includes('Detalles:') && (
              <>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-1">Detalles</h4>
                <p className="text-[13.5px] text-[#A8A8AA] leading-relaxed whitespace-pre-line">
                  {detail.descripcion.split('Detalles:')[1].trim()}
                </p>
              </>
            )}
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
              <span className="text-sm font-semibold capitalize">{formatDatePreference(detail.cuestionario.cuandoLoNecesita)}</span>
            </div>
          </div>

          {/* Ubicación y Horario */}
          <div className="flex flex-col gap-5 border-t border-b border-[#292929] py-5 mt-2">
            <div className="flex items-start gap-4">
              <div className="bg-[#323232] rounded-[6px] p-2 text-[#A8A8AA] shrink-0 mt-0.5">
                <MapPinIcon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-[#A8A8AA] uppercase tracking-wide">Ubicación</span>
                <p className="text-[13px] font-medium text-white">{detail.ubicacion}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-[#323232] rounded-[6px] p-2 text-[#A8A8AA] shrink-0 mt-0.5">
                <ClockIcon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-[#A8A8AA] uppercase tracking-wide">Horario de preferencia</span>
                <p className="text-[13px] font-medium text-white">{detail.horarioPreferencia || 'Indistinto'}</p>
              </div>
            </div>
          </div>

          {/* Fotos (Si las hay) */}
          {detail.imagenesUrl && detail.imagenesUrl.length > 0 && (
            <div>
              <p className="text-xs text-[#A8A8AA] font-bold mb-2 uppercase">Fotos adjuntas</p>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {detail.imagenesUrl.map((url, i) => (
                  <div 
                    key={i} 
                    className="h-28 w-28 shrink-0 rounded-[6px] bg-[#323232] overflow-hidden border border-[#292929] cursor-pointer hover:border-[#F78736] transition-colors relative group"
                    onClick={() => setSelectedImage(getSupabasePublicUrl(url))}
                  >
                    <img src={getSupabasePublicUrl(url)} alt="Problema" className="h-full w-full object-cover group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-semibold">Ver</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          {!readOnly && (
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
          )}
        </div>
      )}
      <ImagePreviewModal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageUrl={selectedImage} 
      />
    </Modal>
  );
}
