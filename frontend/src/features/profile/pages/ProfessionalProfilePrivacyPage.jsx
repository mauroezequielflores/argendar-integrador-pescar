import { useNavigate } from "react-router-dom";
import {
  IdentificationIcon,
  AdjustmentsHorizontalIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const OPCIONES = [
  {
    icon: IdentificationIcon,
    titulo: "Administrar permisos",
    descripcion: "Controlá los permisos de privacidad para ofrecerte contenido personalizado.",
    ruta: "/professional/profile/profile-privacy/manage-privacy",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    titulo: "Configurar Cookies",
    descripcion: "Consulta los tipos de cookies que usamos y configurá tus preferencias.",
    ruta: "/professional/profile/profile-privacy/cookie-settings",
  },
];

export default function ProfessionalProfilePrivacyPage() {
  const navigate = useNavigate();
  const handleBack = () => navigate("/professional/profile");

  return (
    <div className="flex w-full flex-col gap-4 p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#A8A8AA]">
        <span className="cursor-pointer transition-colors hover:text-white" onClick={handleBack}>
          Mi perfil
        </span>
        <span>›</span>
        <span className="font-medium text-white">Privacidad</span>
      </nav>

      {/* Contenedor principal */}
      <div className="flex min-h-[520px] flex-col justify-between rounded-lg border border-[#262626] bg-[#212121]">
        <div>
          {/* Título */}
          <div className="border-b border-[#2e2e2e] p-6 pb-5">
            <h1 className="text-xl font-semibold text-white">Privacidad</h1>
            <p className="mt-1 text-xs text-[#8e8e93]">
              Preferencias y control sobre el uso de tus datos.
            </p>
          </div>

          {/* Panel de gestión */}
          <div className="p-6">
            <div className="rounded-lg border border-[#333333] bg-[#2a2a2a]">
              <div className="border-b border-[#333333] px-5 py-4">
                <p className="text-sm font-semibold text-white">
                  Gestioná la privacidad de tu cuenta
                </p>
              </div>
              <div className="divide-y divide-[#333333]">
                {OPCIONES.map(({ icon: Icon, titulo, descripcion, ruta }) => (
                  <button
                    key={titulo}
                    type="button"
                    onClick={() => navigate(ruta)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#333333]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3a3a3a]">
                      <Icon className="h-5 w-5 text-[#A8A8AA]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{titulo}</p>
                      <p className="text-xs text-[#8e8e93]">{descripcion}</p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 shrink-0 text-[#A8A8AA]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-between border-t border-[#2e2e2e] p-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md border border-[#3e3e3e] bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2c2c2c]"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Volver
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md border border-[#3e3e3e] bg-transparent px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2c2c2c]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
