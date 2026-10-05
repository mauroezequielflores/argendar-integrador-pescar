import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCrearSolicitud } from "../hooks/useAgendaQueries";
import {
  MapPinIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  PhotoIcon,
  PencilIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

// UI Components
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import Stepper from "../../../components/ui/Stepper";
import Button from "../../../components/ui/Button";
import { useCreateRequest } from "../context/CreateRequestContext";
import { api } from "../../../libs/axios";
import { getSupabasePublicUrl } from "../../../utils/formatters";
import ImagePreviewModal from "../../../components/ui/ImagePreviewModal";
import StatusModal from "../../../components/ui/StatusModal";

export default function CreateRequestRevisionPage() {
  const navigate = useNavigate();
  const { requestData, clearRequestData } = useCreateRequest();
  const { mutateAsync: publicarSolicitud, isPending: isPublishing } = useCrearSolicitud();
  const [selectedImage, setSelectedImage] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", description: "", type: "success", onCloseAction: null });
  const submitLockRef = useRef(false);

  const handleEdit = (stepPath) => {
    navigate(`/client/agenda/create-request${stepPath}`);
  };

  const handleBack = () => {
    navigate("/client/agenda/create-request/location");
  };

  const handleCancel = () => {
    clearRequestData();
    navigate("/client/agenda");
  };

  const handlePublish = async () => {
    if (submitLockRef.current || isPublishing) return;
    submitLockRef.current = true;

    try {
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      const photosBase64 = await Promise.all(
        (requestData.photos || []).map(async (file) => {
          if (typeof file === 'string') return file;
          return await toBase64(file);
        })
      );

      const dateMap = {
        "Esta semana": "this_week",
        "Lo antes posible": "urgent",
        "Este fin de semana": "this_month", // Usando this_month porque no existe this_weekend en el enum de la BD
        "Soy Flexible": "flexible"
      };

      const payload = {
        categoryId: Number(requestData.category || 1),
        title: requestData.title || "Nueva Solicitud",
        description: requestData.description + (requestData.additionalDetails ? `\n\nDetalles: ${requestData.additionalDetails}` : ''),
        datePreference: dateMap[requestData.date] || "flexible",
        timePreference: requestData.time || "flexible",
        installationAge: requestData.age || null,
        isEmergency: requestData.isEmergency === "SI",
        hasMaterials: requestData.hasMaterials === "SI",
        address: requestData.address || "Sin especificar",
        neighborhood: requestData.neighborhood || "",
        city: requestData.city || "",
        latitude: requestData.latitude || null,
        longitude: requestData.longitude || null,
        photos: photosBase64
      };

      await publicarSolicitud(payload);

      setAlertConfig({
        isOpen: true,
        type: "success",
        title: "¡Solicitud publicada!",
        description: "La solicitud fue publicada exitosamente en el Marketplace.",
        buttonText: "Volver a Mi agenda",
        onCloseAction: () => {
          clearRequestData();
          navigate("/client/agenda");
        }
      });
    } catch (error) {
      submitLockRef.current = false;
      console.error("Error al publicar la solicitud:", error);
      const errorMessage = error.response?.data?.error?.message || "Ocurrió un error al intentar publicar la solicitud.";
      setAlertConfig({
        isOpen: true,
        type: "error",
        title: "Error al publicar",
        description: errorMessage,
        buttonText: "Intentar nuevamente"
      });
    }
  };

  return (
    <div className="flex flex-col text-white pb-12 w-full max-w-4xl mx-auto">
      {/* Top area */}
      <div className="mb-6">
        <Breadcrumbs items={[{ label: "Solicitud" }, { label: "Detalles" }, { label: "Ubicación" }, { label: "Revisión" }]} />
      </div>

      {/* Stepper */}
      <div className="bg-[#292929] rounded-[12px] p-8 pt-40 md:p-10 border border-[#3f3f3f]">
        <div className="mb-10 pb-8 pt-8">
          <Stepper steps={["DETALLE", "UBICACIÓN", "REVISIÓN"]} currentStep={3} />
        </div>

        {/* Page Header */}
        <div className="mb-8 border-b border-[#3f3f3f] pb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Revisá tu Solicitud</h1>
            <p className="text-sm text-[#A8A8AA]">Verificá toda la información antes de publicarla.</p>
          </div>
          <div className="bg-[#F78736]/10 border border-[#F78736] text-[#F78736] text-[10px] font-bold px-3 py-1 rounded-[4px] tracking-widest uppercase shrink-0">
            Paso 3 de 3
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-8">

          {/* UBICACIÓN */}
          <section className="flex items-start gap-4 pb-6 px-8 md:px-10 -mx-8 md:-mx-10 border-b border-[#3f3f3f]">
            <div className="w-12 h-12 rounded-lg bg-[#323232] flex items-center justify-center shrink-0">
              <MapPinIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 flex flex-col gap-1 mt-1">
              <span className="text-xs text-[#A8A8AA] font-bold tracking-widest uppercase">UBICACIÓN</span>
              <span className="text-sm text-white font-bold">{requestData.address || "-"}</span>
              {requestData.apartment && <span className="text-xs text-[#A8A8AA]">{requestData.apartment}</span>}
            </div>
            <button
              type="button"
              onClick={() => handleEdit("/location")}
              className="flex items-center gap-1.5 text-[#F78736] border-1 rounded-[6px] p-2 text-xs font-bold shrink-0 self-start mt-1 hover:text-[#e0752b] transition-colors"
            >
              <PencilIcon className="h-4 w-4 stroke-2" /> Editar
            </button>
          </section>

          {/* CATEGORÍA */}
          <section className="flex items-start gap-4 pb-6 px-8 md:px-10 -mx-8 md:-mx-10 border-b border-[#3f3f3f]">
            <div className="w-12 h-12 rounded-lg bg-[#323232] flex items-center justify-center shrink-0">
              <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 flex flex-col gap-1 mt-1">
              <span className="text-xs text-[#A8A8AA] font-bold tracking-widest uppercase">CATEGORÍA</span>
              <span className="text-sm text-white font-bold">{requestData.category || "-"}</span>
              <span className="text-sm text-[#A8A8AA]">{requestData.title || "-"}</span>
            </div>
            <button
              type="button"
              onClick={() => handleEdit("")}
              className="flex items-center gap-1.5 text-[#F78736] border-1 rounded-[6px] p-2  text-xs font-bold shrink-0 self-start mt-1 hover:text-[#e0752b] transition-colors"
            >
              <PencilIcon className="h-4 w-4 stroke-2" /> Editar
            </button>
          </section>

          {/* CUESTIONARIO DE DETALLES */}
          <section className="flex items-start gap-4 pb-6 px-8 md:px-10 -mx-8 md:-mx-10 border-b border-[#3f3f3f]">
            <div className="w-12 h-12 rounded-lg bg-[#323232] flex items-center justify-center shrink-0">
              <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 flex flex-col gap-4 mt-1">
              <span className="text-xs text-[#A8A8AA] font-bold tracking-widest uppercase">CUESTIONARIO DE DETALLES</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#A8A8AA] uppercase tracking-wider">¿ES UNA EMERGENCIA?</span>
                  <span className="text-sm text-white font-bold">{requestData.isEmergency || "-"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#A8A8AA] uppercase tracking-wider">¿CUÁNDO LO NECESITA?</span>
                  <span className="text-sm text-white font-bold">{requestData.date || "-"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#A8A8AA] uppercase tracking-wider">¿TIENE LOS MATERIALES?</span>
                  <span className="text-sm text-white font-bold">{requestData.hasMaterials || "-"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#A8A8AA] uppercase tracking-wider">¿CUÁNTOS AÑOS DE ANTIGÜEDAD TIENE EL EQUIPO O INSTALACIÓN?</span>
                  <span className="text-sm text-white font-bold">{requestData.age ? `${requestData.age} AÑOS` : "-"}</span>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-xs text-[#A8A8AA] uppercase tracking-wider">DESCRIPCIÓN GENERAL DEL PROBLEMA</span>
                  <span className="text-sm text-white font-bold leading-relaxed">{requestData.description || "-"}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleEdit("")}
              className="flex items-center gap-1.5 text-[#F78736] border-1 rounded-[6px] p-2 text-xs font-bold shrink-0 self-start mt-1 hover:text-[#e0752b] transition-colors"
            >
              <PencilIcon className="h-4 w-4 stroke-2" /> Editar
            </button>
          </section>

          {/* DISPONIBILIDAD */}
          <section className="flex items-start gap-4 pb-6 px-8 md:px-10 -mx-8 md:-mx-10 border-b border-[#3f3f3f]">
            <div className="w-12 h-12 rounded-lg bg-[#323232] flex items-center justify-center shrink-0">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 flex flex-col gap-1 mt-1">
              <span className="text-xs text-[#A8A8AA] font-bold tracking-widest uppercase">DISPONIBILIDAD</span>
              <span className="text-xs text-[#A8A8AA] uppercase tracking-wider mt-2">RANGO HORARIO SELECCIONADO</span>
              <span className="text-sm text-white font-bold">{requestData.time || "-"}</span>
            </div>
            <button
              type="button"
              onClick={() => handleEdit("")}
              className="flex items-center gap-1.5 text-[#F78736] border-1 rounded-[6px] p-2  text-xs font-bold shrink-0 self-start mt-1 hover:text-[#e0752b] transition-colors"
            >
              <PencilIcon className="h-4 w-4 stroke-2" /> Editar
            </button>
          </section>

          {/* FOTOS */}
          <section className="flex items-start gap-4 pb-4 px-8 md:px-10 -mx-8 md:-mx-10">
            <div className="w-12 h-12 rounded-lg bg-[#323232] flex items-center justify-center shrink-0">
              <PhotoIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 flex flex-col gap-4 mt-1">
              <span className="text-xs text-[#A8A8AA] font-bold tracking-widest uppercase">FOTOS</span>
              <div className="flex flex-wrap gap-4">
                {(requestData.photos && requestData.photos.length > 0) ? requestData.photos.map((file, idx) => {
                  const src = file.preview || (typeof file === 'string' ? getSupabasePublicUrl(file) : '');
                  return (
                    <div
                      key={idx}
                      className="w-28 h-28 shrink-0 bg-[#323232] rounded-[8px] flex items-center justify-center overflow-hidden border border-[#3f3f3f] cursor-pointer hover:border-[#F78736] transition-colors relative group"
                      onClick={() => setSelectedImage(src)}
                    >
                      <img src={src} alt="Preview" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-semibold">Ver</span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-sm text-[#A8A8AA]">Sin fotos adjuntas</div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleEdit("")}
              className="flex items-center gap-1.5 text-[#F78736] border-1 rounded-[6px] p-2 text-xs font-bold shrink-0 self-start mt-1 hover:text-[#e0752b] transition-colors"
            >
              <PencilIcon className="h-4 w-4 stroke-2" /> Editar
            </button>
          </section>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[#3f3f3f] gap-4 mt-4">
          <Button type="button" variant="ghost" onClick={handleBack} className="w-full sm:w-auto px-6 text-white border-[#727272] flex items-center justify-center gap-2 border border-[#3f3f3f]">
            <ArrowLeftIcon className="h-4 w-4" /> Volver
          </Button>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <Button type="button" variant="secondary" onClick={handleCancel} className="w-full sm:w-auto px-10 bg-[#727272] border-[#727272] text-white hover:bg-[#5f5f5f]">
              Cancelar
            </Button>
            <Button type="button" variant="primary" onClick={handlePublish} disabled={isPublishing} className="w-full sm:w-auto px-10 bg-[#F78736] border-[#F78736] hover:bg-[#e0752b]">
              {isPublishing ? "Publicando..." : "Publicar Solicitud"}
            </Button>
          </div>
        </div>

      </div>

      <ImagePreviewModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />

      <StatusModal
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        description={alertConfig.description}
        buttonText={alertConfig.buttonText}
        onClose={() => {
          setAlertConfig((prev) => ({ ...prev, isOpen: false }));
          if (alertConfig.onCloseAction) {
            alertConfig.onCloseAction();
          }
        }}
      />
    </div>
  );
}
