import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeftIcon,
  PencilSquareIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";

import Card from "../../../components/ui/Card";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import EditField from "../components/EditField";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";
import InfoAlert from "../../../components/ui/InfoAlert";
import Loader from "../../../components/ui/Loader";

export default function EditProfileSettingsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de carga
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate("/client/profile/profile-settings");
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
            { label: "Configurar perfil", href: "/client/profile/profile-settings" },
            { label: "Editar configuraciones de perfil" }
          ]} 
        />
      </div>

      {/* ─── Contenedor Principal ─── */}
      <Card className="border border-[#3a3a3a] bg-[#202020]">
        
        {/* Cabecera */}
        <div className="p-6 md:p-8 border-b border-[#3a3a3a]">
          <h1 className="text-[32px] font-bold text-white leading-none">Editar configuraciones de perfil</h1>
          <p className="text-sm text-[#A8A8AA] mt-2">
            Podés agregar, modificar o corregir tu información personal y los datos de la cuenta.
          </p>
        </div>

        {/* Contenido (Bloques) */}
        <div className="p-6 md:p-8 flex flex-col gap-10">
          
          {/* Bloque 1: Información personal */}
          <section>
            <h2 className="text-[20px] font-semibold text-white mb-2">Información personal</h2>
            <p className="text-sm text-[#A8A8AA] mb-6">
              Ahora podés modificar tus datos. Estos cambios se verán reflejados en tu perfil profesional.
            </p>
            
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditField 
                  label="Nombre"
                  value="Hernán"
                  verified={true}
                />
                <EditField 
                  label="Apellido"
                  value="Gómez"
                  verified={true}
                />
              </div>

              <InfoAlert>
                Asegurate de que el nombre coincida con tu documento de identidad para evitar problemas en futuras validaciones de pagos o servicios.
              </InfoAlert>

              <div className="w-full">
                <EditField 
                  label="Número de documento"
                  value="Ingresa tu número de documento"
                  prefix="DNI"
                  required={true}
                />
              </div>

              <InfoAlert>
                Tu número de documento nos ayuda a verificar tu identidad.
              </InfoAlert>
            </div>
          </section>

          {/* Bloque 2: Ubicación */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[20px] font-semibold text-white mb-1">Ubicación</h2>
                <p className="text-sm text-[#A8A8AA]">Seleccionar una ubicación en nuestro mapa:</p>
              </div>
              <button className="flex-shrink-0 flex items-center justify-center h-[38px] w-[38px] rounded-md border border-[#3a3a3a] bg-[#2e2e2e] hover:bg-[#3a3a3a] transition-colors">
                <PencilSquareIcon className="h-4 w-4 text-white" />
              </button>
            </div>

            <Card className="bg-[#292929] border border-[#3a3a3a] p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#3a3a3a] flex-shrink-0">
                <MapPinIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white uppercase tracking-wider mb-1">Ubicación Profesional Principal</span>
                <span className="text-sm font-semibold text-white">Av. Santa Fe 2534, Piso 4, Dpto B</span>
                <span className="text-xs text-[#A8A8AA]">Palermo, Ciudad Autónoma de Buenos Aires</span>
              </div>
            </Card>
          </section>

          {/* Bloque 3: Datos de la cuenta */}
          <section>
            <h2 className="text-[20px] font-semibold text-white mb-6">Datos de la cuenta</h2>
            
            <div className="flex flex-col gap-6">
              <div className="w-full">
                <EditField 
                  label="Correo electrónico"
                  value="correodeejemplo@hotmail.com"
                  verified={true}
                />
              </div>

              <div className="w-full flex items-center justify-between bg-[#292929] border border-[#3a3a3a] rounded-md p-4">
                <div className="flex flex-col pr-4">
                  <span className="text-sm font-medium text-white">Permisos de comunicaciones</span>
                  <span className="text-xs text-[#A8A8AA] mt-1">Nos permiten enviarte comunicaciones de soporte o actualizaciones de la plataforma a tu correo electrónico.</span>
                </div>
                <ToggleSwitch initialEnabled={true} />
              </div>

              <div className="w-full">
                <EditField 
                  label="Número de teléfono"
                  value="+5411908272675"
                  required={true}
                />
              </div>

              <div className="w-full flex items-center justify-between bg-[#292929] border border-[#3a3a3a] rounded-md p-4">
                <div className="flex flex-col pr-4">
                  <span className="text-sm font-medium text-white">Permisos de comunicaciones o verificación</span>
                  <span className="text-xs text-[#A8A8AA] mt-1">Nos permiten enviarte códigos de verificación y comunicaciones de tu cuenta a tu número de teléfono.</span>
                </div>
                <ToggleSwitch initialEnabled={true} />
              </div>

              <div className="w-full">
                <EditField 
                  label="Contraseña"
                  value="Cambiar contraseña"
                  type="text" // Usamos text para que se lea literal "Cambiar contraseña" bloqueado como en la maqueta
                  required={true}
                />
              </div>

              <InfoAlert>
                En caso de cambiar contraseña deberá realizar la verificación de dos pasos.
              </InfoAlert>
            </div>
          </section>

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
