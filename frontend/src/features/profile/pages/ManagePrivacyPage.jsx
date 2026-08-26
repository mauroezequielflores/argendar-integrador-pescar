import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? "bg-[#F78736]" : "bg-[#3a3a3a]"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function ManagePrivacyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.pathname.match(/^\/(professional|client)/);
  const prefix = match ? `/${match[1]}` : "";
  const [localizacion, setLocalizacion] = useState(true);

  const handleBack = () => navigate(`${prefix}/profile/profile-privacy`);
  const handleCancel = () => {
    setLocalizacion(true); // descarta cambios
    navigate(`${prefix}/profile/profile-privacy`);
  };

  return (
    <div className="flex w-full flex-col gap-4 p-6 bg-[#181818] min-h-screen text-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#909092]">
        <span
          className="cursor-pointer transition-colors hover:text-white"
          onClick={() => navigate(`${prefix}/profile`)}
        >
          Mi perfil
        </span>
        <span className="text-[#505052] font-semibold">{`>`}</span>
        <span
          className="cursor-pointer transition-colors hover:text-white"
          onClick={handleBack}
        >
          Privacidad
        </span>
        <span className="text-[#505052] font-semibold">{`>`}</span>
        <span className="text-white font-medium">Administrar privacidad</span>
      </nav>

      {/* Contenedor principal estilo tarjeta */}
      <div className="flex flex-col justify-between rounded-lg border border-[#262626] bg-[#212121] min-h-[520px]">
        
        {/* Sección Superior: Título y Configuración */}
        <div>
          {/* Título y Subtítulo */}
          <div className="border-b border-[#2e2e2e] p-6 pb-5">
            <h1 className="text-xl font-semibold text-white">
              Administrar servicios de privacidad
            </h1>
            <p className="mt-1 text-xs text-[#8e8e93]">
              Estos cambios pueden tardar en confirmarse en nuestro sistema.
            </p>
          </div>

          {/* Permiso de localización */}
          <div className="p-6">
            <div className="flex items-center justify-between gap-6 rounded-lg bg-[#2a2a2a] p-4 border border-[#333333]">
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">
                  Permisos de localización
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#8e8e93]">
                  Mantené activo el permiso de localización desde la configuración
                  de tu dispositivo para acceder a solicitudes disponibles en tu
                  área.
                </p>
              </div>
              <Toggle checked={localizacion} onChange={setLocalizacion} />
            </div>
          </div>
        </div>

        {/* Sección Inferior: Botones de Acción */}
        <div className="flex items-center justify-between border-t border-[#2e2e2e] p-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md border border-[#3e3e3e] bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2c2c2c]"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 text-white" />
            Volver
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 rounded-md border border-[#3e3e3e] bg-transparent px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2c2c2c]"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}