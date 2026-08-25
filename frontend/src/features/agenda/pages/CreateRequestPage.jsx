import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WrenchScrewdriverIcon, BoltIcon, FireIcon, CalendarIcon, ClockIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// UI Components
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import Stepper from "../../../components/ui/Stepper";
import PageHeader from "../../../components/ui/PageHeader";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import RadioSelect from "../../../components/ui/RadioSelect";
import Button from "../../../components/ui/Button";
import FileUpload from "../../../components/ui/FileUpload";
import CategoryCard from "../components/CategoryCard";

// Context & Schema
import { useCreateRequest } from "../context/CreateRequestContext";
import { createRequestStep1Schema } from "../../../validations/request.schema";

const CATEGORIES = [
  { id: "plomeria", title: "Plomería", description: "Reparaciones de cañerías, grifería y mucho más.", icon: WrenchScrewdriverIcon },
  { id: "electricidad", title: "Electricidad", description: "Instalaciones, cortocircuitos, tableros.", icon: BoltIcon },
  { id: "climatizacion", title: "Climatización", description: "Aire acondicionado, estufas, calderas.", icon: FireIcon },
];

const YES_NO_OPTIONS = [
  { value: "SI", label: "SI" },
  { value: "NO", label: "NO" },
];

const DATE_OPTIONS = [
  { value: "Esta semana", label: "Esta semana" },
  { value: "Lo antes posible", label: "Lo antes posible" },
  { value: "Este fin de semana", label: "Este fin de semana" },
  { value: "Soy Flexible", label: "Soy Flexible" },
];

const TIME_OPTIONS = [
  { value: "Mañana 08:00 - 12:00", label: "Mañana", description: "08:00 - 12:00" },
  { value: "Tarde 12:00 - 17:00", label: "Tarde", description: "12:00 - 17:00" },
  { value: "Noche 17:00 - 21:00", label: "Noche", description: "17:00 - 21:00" },
  { value: "Cualquier horario", label: "Cualquier horario", description: "Estoy disponible todo el día" },
];

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const { requestData, updateRequestData, clearRequestData } = useCreateRequest();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createRequestStep1Schema),
    defaultValues: {
      category: requestData.category || "",
      title: requestData.title || "",
      description: requestData.description || "",
      age: requestData.age || "",
      isEmergency: requestData.isEmergency || "",
      hasMaterials: requestData.hasMaterials || "",
      date: requestData.date || "",
      time: requestData.time || "",
    }
  });

  const selectedCategory = watch("category");

  const onSubmit = (data) => {
    updateRequestData(data);
    navigate("/client/agenda/create-request/location");
  };

  const handleCancel = () => {
    clearRequestData();
    navigate("/client/agenda");
  };

  return (
    <div className="flex flex-col text-white pb-12 w-full max-w-4xl mx-auto">
      {/* Top area */}
      <div className="mb-6">
        <Breadcrumbs items={[{ label: "Solicitud" }, { label: "Categoría" }]} />
      </div>

      <div className="bg-[#292929] rounded-[16px] p-8 md:p-10 border border-[#3f3f3f]">
        <div className="mb-10">
          <Stepper steps={["DETALLE", "UBICACIÓN", "REVISIÓN"]} currentStep={1} />
        </div>

        <div className="mb-8 border-b border-[#3f3f3f] pb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Detalla tu solicitud.</h1>
            <p className="text-sm text-[#A8A8AA]">Elegí la categoría que mejor represente tu problema.</p>
          </div>
          <div className="bg-[#F78736]/10 border border-[#F78736] text-[#F78736] text-[10px] font-bold px-3 py-1 rounded-[4px] tracking-widest uppercase shrink-0">
            Paso 1 de 3
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        
        {/* Categories Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white mb-1">Seleccioná categoría y completa la encuesta.</h2>
            <p className="text-xs text-[#A8A8AA]">Selecciona la categoría y responde las preguntas que le permita comprender</p>
            {errors.category && <span className="text-xs text-red-400 block mt-1">{errors.category.message}</span>}
          </div>
          
          <div className="mb-4 text-xs font-semibold text-white">Seleccioná una categoría:</div>
          <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                icon={cat.icon}
                title={cat.title}
                description={cat.description}
                isSelected={selectedCategory === cat.id}
                onClick={() => setValue("category", cat.id, { shouldValidate: true })}
              />
            ))}
          </div>
        </section>

        {/* General Details */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="col-span-1 md:col-span-2">
            <Input
              id="title"
              label="Ingrese un titulo breve que resuma tu situación."
              placeholder="Ej: Necesito un servicio de plomería para una reparación de cañerías. Problemas de luz en..."
              {...register("title")}
              error={errors.title?.message}
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="flex justify-between mb-1">
              <label htmlFor="description" className="text-xs font-medium text-white">¿Necesitas ser más especifico? Describí tu situación</label>
              <span className="text-[10px] font-bold tracking-widest text-[#A8A8AA] uppercase">Opcional</span>
            </div>
            <Textarea
              id="description"
              placeholder="Contanos brevemente qué necesitas resolver para que el profesional pueda darte un presupuesto más preciso..."
              maxLength={500}
              {...register("description")}
              error={errors.description?.message}
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col">
            <div className="flex justify-between mb-1">
              <label htmlFor="age" className="text-xs font-medium text-white">¿Cuántos años de antigüedad tiene el equipo o instalación?</label>
              <span className="text-[10px] font-bold tracking-widest text-[#A8A8AA] uppercase">Opcional</span>
            </div>
            <div className="relative w-full">
              <input
                id="age"
                type="number"
                placeholder="Ej: 5"
                {...register("age")}
                className="w-full rounded-[6px] border border-[#3f3f3f] bg-[#202020] py-2.5 px-3 text-sm text-white placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none focus:ring-1 focus:ring-[#F78736]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A8A8AA]">años</span>
            </div>
          </div>

          <div className="col-span-1">
            <Controller
              name="isEmergency"
              control={control}
              render={({ field }) => (
                <Select
                  id="isEmergency"
                  label="¿Es una emergencia?"
                  options={YES_NO_OPTIONS}
                  error={errors.isEmergency?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className="col-span-1">
            <Controller
              name="hasMaterials"
              control={control}
              render={({ field }) => (
                <Select
                  id="hasMaterials"
                  label="¿Tiene los materiales?"
                  options={YES_NO_OPTIONS}
                  error={errors.hasMaterials?.message}
                  {...field}
                />
              )}
            />
          </div>
        </section>

        {/* Availability Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="col-span-1 md:col-span-2">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <RadioSelect
                  id="date"
                  label="¿Para cuándo necesitas un turno?"
                  options={DATE_OPTIONS}
                  icon={CalendarIcon}
                  error={errors.date?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <RadioSelect
                  id="time"
                  label="¿Que horario se acomoda a tu agenda?"
                  options={TIME_OPTIONS}
                  icon={ClockIcon}
                  error={errors.time?.message}
                  {...field}
                />
              )}
            />
          </div>
        </section>

        {/* Upload Section */}
        <section>
          <h2 className="text-lg font-bold mb-1">Adjuntá fotografías</h2>
          <p className="text-xs text-[#A8A8AA] mb-6">Las imágenes ayudarán al Profesional a comprender mejor el problema.</p>
          <FileUpload maxFiles={3} maxSizeMB={5} onFilesChange={(files) => console.log('Files:', files)} />
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[#3f3f3f] gap-4 mt-4">
          <Button variant="ghost" onClick={handleCancel} className="w-full sm:w-auto px-6 flex items-center justify-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" /> Volver
          </Button>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <Button variant="secondary" onClick={handleCancel} className="w-full sm:w-auto px-10 bg-[#727272] border-[#727272] text-white hover:bg-[#5f5f5f]">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto px-10 bg-[#F78736] border-[#F78736] hover:bg-[#e0752b]">
              Continuar
            </Button>
          </div>
        </div>

      </form>
      </div>
    </div>
  );
}
