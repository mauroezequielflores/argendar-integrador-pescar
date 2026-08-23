import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";

export default function ManagePrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Mi perfil", path: "/client/profile" },
          { label: "Privacidad", path: "/client/profile/profile-privacy" },
          { label: "Administrar privacidad" },
        ]}
      />

      <Card className="flex flex-col border border-[#3a3a3a] bg-[#202020] p-0">
        {/* Cabecera */}
        <div className="p-6 md:p-8 border-b border-[#3a3a3a]">
          <h1 className="text-[24px] md:text-[28px] font-bold text-white mb-2">
            Administrar servicios de privacidad
          </h1>
          <p className="text-sm md:text-base text-[#A8A8AA]">
            Estos cambios pueden tardar en confirmarse en nuestro sistema.
          </p>
        </div>

        {/* Cuerpo */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between overflow-hidden rounded-md border border-[#3a3a3a] bg-[#292929] px-6 py-5">
            <div className="flex flex-col pr-4">
              <span className="text-[15px] font-semibold text-white mb-1">Permisos de localización</span>
              <span className="text-xs text-[#A8A8AA]">
                Mantené activo el permiso de localización desde la configuración de tu dispositivo para acceder a solicitudes disponibles en tu área.
              </span>
            </div>
            <div className="flex-shrink-0 ml-4">
              <ToggleSwitch initialEnabled={true} />
            </div>
          </div>
        </div>

        {/* Footer (Botones) */}
        <div className="mt-auto flex items-center justify-between border-t border-[#3a3a3a] p-6 md:p-8">
          <button
            type="button"
            onClick={() => navigate("/client/profile/profile-privacy")}
            className="flex items-center gap-2 rounded-md border border-[#3a3a3a] bg-[#292929] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
          >
            <span aria-hidden="true">&larr;</span> Volver
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/client/profile/profile-privacy")}
            className="rounded-md border border-[#3a3a3a] bg-[#292929] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
          >
            Cancelar
          </button>
        </div>
      </Card>
    </div>
  );
}
