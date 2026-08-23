import { useNavigate } from "react-router-dom";
import { IdentificationIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";

import Card from "../../../components/ui/Card";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import NavRow from "../../../components/ui/NavRow";

export default function ProfilePrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Mi perfil", path: "/client/profile" },
          { label: "Privacidad" },
        ]}
      />

      <Card className="flex flex-col border border-[#3a3a3a] bg-[#202020] p-0">
        {/* Cabecera */}
        <div className="p-6 md:p-8 border-b border-[#3a3a3a]">
          <h1 className="text-[24px] md:text-[28px] font-bold text-white mb-2">
            Privacidad
          </h1>
          <p className="text-sm md:text-base text-[#A8A8AA]">
            Preferencias y control sobre el uso de tus datos.
          </p>
        </div>

        {/* Cuerpo */}
        <div className="p-6 md:p-8">
          <div className="overflow-hidden rounded-md border border-[#3a3a3a] bg-[#292929]">
            {/* Título de sección interna */}
            <div className="border-b border-[#3a3a3a] px-6 py-5">
              <h2 className="text-[18px] font-semibold text-white">
                Gestioná la privacidad de tu cuenta
              </h2>
            </div>
            
            {/* Opciones (NavRows) */}
            <div className="flex flex-col">
              <NavRow
                icon={IdentificationIcon}
                title="Administrar permisos"
                subtitle="Controlá los permisos de privacidad para ofrecerte contenido personalizado."
                onClick={() => navigate("/client/profile/profile-privacy/manage-privacy")}
              />
              <NavRow
                icon={ViewColumnsIcon}
                title="Configurar Cookies"
                subtitle="Consulta los tipos de cookies que usamos y configurá tus preferencias."
                onClick={() => navigate("/client/profile/profile-privacy/cookie-settings")}
              />
            </div>
          </div>
        </div>

        {/* Footer (Botones) */}
        <div className="mt-auto flex items-center justify-between border-t border-[#3a3a3a] p-6 md:p-8">
          <button
            type="button"
            onClick={() => navigate("/client/profile")}
            className="flex items-center gap-2 rounded-md border border-[#3a3a3a] bg-[#292929] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
          >
            <span aria-hidden="true">&larr;</span> Volver
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/client/profile")}
            className="rounded-md border border-[#3a3a3a] bg-[#292929] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
          >
            Cancelar
          </button>
        </div>
      </Card>
    </div>
  );
}
