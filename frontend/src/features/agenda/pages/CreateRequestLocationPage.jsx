import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  MapPinIcon, 
  HomeIcon, 
  EnvelopeIcon, 
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  MapIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

// UI Components
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import Stepper from "../../../components/ui/Stepper";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Button from "../../../components/ui/Button";

// Context & Schema
import { useCreateRequest } from "../context/CreateRequestContext";
import { createRequestStep2Schema } from "../../../validations/request.schema";

export default function CreateRequestLocationPage() {
  const navigate = useNavigate();
  const { requestData, updateRequestData, clearRequestData } = useCreateRequest();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createRequestStep2Schema),
    defaultValues: {
      address: requestData.address || "",
      apartment: requestData.apartment || "",
      zipCode: requestData.zipCode || "",
      additionalDetails: requestData.additionalDetails || "",
    }
  });

  const addressValue = watch("address");
  const apartmentValue = watch("apartment");
  const zipCodeValue = watch("zipCode");
  const additionalDetailsValue = watch("additionalDetails");

  const onSubmit = (data) => {
    updateRequestData(data);
    navigate("/client/agenda/create-request/revision");
  };

  const handleBack = () => {
    // Para guardar los cambios actuales al volver, usamos watch y update:
    updateRequestData({ 
      address: addressValue, 
      apartment: apartmentValue, 
      zipCode: zipCodeValue, 
      additionalDetails: additionalDetailsValue 
    });
    navigate("/client/agenda/create-request");
  };

  const handleCancel = () => {
    clearRequestData();
    navigate("/client/agenda");
  };

  return (
    <div className="flex flex-col text-white pb-12 w-full max-w-5xl mx-auto">
      {/* Top area */}
      <div className="mb-6">
        <Breadcrumbs items={[{ label: "Solicitud" }, { label: "Detalle" }, { label: "Ubicación" }]} />
      </div>

      <div className="bg-[#292929] rounded-[16px] p-8 md:p-10 border border-[#3f3f3f]">
        {/* Stepper */}
        <div className="mb-10">
          <Stepper steps={["DETALLE", "UBICACIÓN", "REVISIÓN"]} currentStep={2} />
        </div>

        {/* Page Header */}
        <div className="mb-8 border-b border-[#3f3f3f] pb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Selecciona la ubicación de tu solicitud.</h1>
            <p className="text-sm text-[#A8A8AA]">Ingresá la dirección donde el Profesional deberá realizar el trabajo.</p>
          </div>
          <div className="bg-[#F78736]/10 border border-[#F78736] text-[#F78736] text-[10px] font-bold px-3 py-1 rounded-[4px] tracking-widest uppercase shrink-0">
            Paso 2 de 3
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column: Form Fields */}
            <div className="flex flex-col gap-6">
              
              <Input
                id="address"
                label="Dirección completa"
                placeholder="Ej: Av. Corrientes 1234, CABA"
                prefix={<MapPinIcon className="h-5 w-5" />}
                {...register("address")}
                error={errors.address?.message}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  id="apartment"
                  label="Apartamento / Hogar (opcional)"
                  placeholder="Ej: Piso 3, Depto B"
                  {...register("apartment")}
                  error={errors.apartment?.message}
                />
                <Input
                  id="zipCode"
                  label="Código postal (opcional)"
                  placeholder="Ej: 1234"
                  type="number"
                  {...register("zipCode")}
                  error={errors.zipCode?.message}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="additionalDetails" className="text-xs font-medium text-white">Detalles adicionales (indicaciones)</label>
                </div>
                <Textarea
                  id="additionalDetails"
                  placeholder="Ej: Tocar timbre dos veces."
                  {...register("additionalDetails")}
                  error={errors.additionalDetails?.message}
                />
              </div>
            </div>

            {/* Right Column: Dynamic Summary */}
            <div className="flex flex-col gap-6">
              
              {/* Summary Card */}
              <div className="border border-[#3f3f3f] bg-[#202020] rounded-[8px] p-6">
                <h2 className="text-sm font-bold text-white mb-6">Resumen de ubicación</h2>
                
                <div className="flex flex-col gap-5 text-sm text-white">
                  {/* Address block with distinct background */}
                  <div className="bg-[#2a2a2a] rounded-[8px] p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-5 w-5 text-[#A8A8AA] shrink-0" />
                      <span className="font-semibold text-white">{addressValue || "-"}</span>
                    </div>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 border-[#555] text-white hover:bg-[#333] transition-colors py-2 text-xs"
                      onClick={() => console.log("Open Map modal")}
                    >
                      <MapIcon className="h-4 w-4" /> Ver en mapa
                    </Button>
                  </div>

                  {/* Apartment */}
                  <div className="flex items-center gap-3">
                    <HomeIcon className="h-5 w-5 text-[#A8A8AA] shrink-0" />
                    <span className="font-semibold truncate">{apartmentValue || "-"}</span>
                  </div>

                  {/* Zip Code */}
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-[#A8A8AA] shrink-0" />
                    <span className="font-semibold">{zipCodeValue || "-"}</span>
                  </div>

                  {/* Indications */}
                  <div className="flex items-start gap-3">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-[#A8A8AA] shrink-0 mt-0.5" />
                    <span className="font-semibold break-words line-clamp-3">
                      {additionalDetailsValue || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Protected Location Alert */}
              <div className="border border-[#3f3f3f] bg-[#202020] rounded-[8px] p-5 flex gap-4 items-start">
                <ShieldCheckIcon className="h-6 w-6 text-[#A8A8AA] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white mb-1">Ubicación protegida</span>
                  <span className="text-xs text-[#A8A8AA]">Tu ubicación únicamente será visible para el profesional al cual aceptes una oferta.</span>
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[#3f3f3f] gap-4 mt-2">
            <Button type="button" variant="ghost" onClick={handleBack} className="w-full sm:w-auto px-6 flex items-center justify-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" /> Volver
            </Button>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
              <Button type="button" variant="secondary" onClick={handleCancel} className="w-full sm:w-auto px-10 bg-[#727272] border-[#727272] text-white hover:bg-[#5f5f5f]">
                Cancelar
              </Button>
              <Button type="submit" variant="primary" className="w-full sm:w-auto px-10 bg-[#F78736] border-[#F78736] hover:bg-[#e0752b]">
                Continuar -&gt;
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
