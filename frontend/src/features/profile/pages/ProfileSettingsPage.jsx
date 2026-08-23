import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  PencilSquareIcon,
  IdentificationIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import InfoRow from "../../../components/ui/InfoRow";

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de carga
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate("/client/profile");
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[500px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
      {/* ─── Navegación Breadcrumbs ─── */}
      <div className="mb-6">
        <Breadcrumbs 
          items={[
            { label: "Mi perfil", href: "/client/profile" },
            { label: "Configurar perfil" }
          ]} 
        />
      </div>

      {/* ─── Contenedor Principal ─── */}
      <Card className="border border-[#3a3a3a] bg-[#202020]">
        
        {/* Cabecera */}
        <div className="flex justify-between items-start sm:items-center p-6 md:p-8 border-b border-[#3a3a3a]">
          <div className="flex-1 pr-4">
            <h1 className="text-[32px] font-bold text-white leading-none">Configurar perfil</h1>
            <p className="text-sm text-[#A8A8AA] mt-2 block sm:whitespace-nowrap">
              Podés agregar, modificar o corregir tu información personal y los datos de la cuenta.
            </p>
          </div>
          <button className="flex-shrink-0 flex items-center gap-2 rounded-md border border-[#3a3a3a] px-4 py-2 text-sm font-medium text-[#FFFFFF] hover:bg-[#3a3a3a] transition-colors bg-[#2e2e2e]">
            <PencilSquareIcon className="h-4 w-4" />
            Editar
          </button>
        </div>

        {/* Contenido (Bloques) */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          
          {/* Bloque 1: Información personal */}
          <Card className="bg-[#292929] border border-[#3a3a3a] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#3a3a3a]">
              <h2 className="text-lg font-bold text-white">Información personal</h2>
            </div>
            <div className="flex flex-col">
              <InfoRow 
                icon={IdentificationIcon}
                title="Hernan Castro"
                subtitle="Nombre y apellido."
                verified={true}
                className="px-6 py-5"
              />
              <InfoRow 
                icon={IdentificationIcon}
                title="00000000"
                subtitle="Número de DNI."
                verified={false}
                className="px-6 py-5"
              />
            </div>
          </Card>

          {/* Bloque 2: Ubicación */}
          <Card className="bg-[#292929] border border-[#3a3a3a] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#3a3a3a]">
              <h2 className="text-lg font-bold text-white">Ubicación</h2>
            </div>
            <div className="flex flex-col">
              <InfoRow 
                icon={MapPinIcon}
                title="Ubicación principal"
                subtitle="Condición verificada."
                verified={false}
                className="px-6 py-5"
              />
            </div>
          </Card>

          {/* Bloque 3: Datos de la cuenta */}
          <Card className="bg-[#292929] border border-[#3a3a3a] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#3a3a3a]">
              <h2 className="text-lg font-bold text-white">Datos de la cuenta</h2>
            </div>
            <div className="flex flex-col">
              <InfoRow 
                icon={EnvelopeIcon}
                title="correoejemplo@gmail.com"
                subtitle="E-mail donde recibís comunicaciones."
                verified={true}
                className="px-6 py-5"
              />
              <InfoRow 
                icon={PhoneIcon}
                title="+5411908272675"
                subtitle="Número donde recibís códigos de verificación y comunicaciones."
                verified={true}
                className="px-6 py-5"
              />
              <InfoRow 
                icon={UserCircleIcon}
                title="Cambiar contraseña"
                subtitle="Contraseña guardada."
                verified={true}
                className="px-6 py-5"
              />
            </div>
          </Card>

        </div>

        {/* Footer (Botones de acción) */}
        <div className="p-6 md:p-8 flex items-center justify-between border-t border-[#3a3a3a]">
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#A8A8AA] hover:text-[#FFFFFF] hover:bg-[#3a3a3a] transition-colors bg-transparent border border-transparent"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver
          </button>
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#A8A8AA] hover:text-[#FFFFFF] hover:border-[#FD7B03] transition-colors bg-transparent border border-[#3a3a3a]"
          >
            Cancelar
          </button>
        </div>

      </Card>
    </div>
  );
}
