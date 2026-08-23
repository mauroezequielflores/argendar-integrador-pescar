import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import ToggleSwitch from "../../../components/ui/ToggleSwitch";

export default function CookieSettingsPage() {
  const navigate = useNavigate();

  // Array para generar las filas de cookies dinámicamente
  const cookieSettings = [
    {
      id: "essential",
      title: "Cookies esenciales",
      description: "Sirven para reconocerte cuando ingresás, guardar tus preferencias de configuración y proteger tu cuenta. No pueden deshabilitarse porque son necesarias para el funcionamiento de nuestro sitio.",
      initialEnabled: true,
      locked: true,
    },
    {
      id: "analytics",
      title: "Cookies analíticas",
      description: "Nos permiten analizar tu navegación en el sitio para que podamos mejorar nuestros servicios.",
      initialEnabled: true,
      locked: false,
    },
    {
      id: "performance",
      title: "Cookies de rendimiento",
      description: "Nos permiten optimizar algunas funciones de nuestro sitio.",
      initialEnabled: false,
      locked: false,
    },
    {
      id: "functional",
      title: "Cookies funcionales",
      description: "Nos permiten mantener el buen funcionamiento de nuestro sitio.",
      initialEnabled: true,
      locked: false,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Mi perfil", path: "/client/profile" },
          { label: "Privacidad", path: "/client/profile/profile-privacy" },
          { label: "Configurar cookies" },
        ]}
      />

      <Card className="flex flex-col border border-[#3a3a3a] bg-[#202020] p-0">
        {/* Cabecera */}
        <div className="p-6 md:p-8 border-b border-[#3a3a3a]">
          <h1 className="text-[24px] md:text-[28px] font-bold text-white mb-2">
            Configurar cookies
          </h1>
          <p className="text-sm md:text-base text-[#A8A8AA]">
            Las cookies son una tecnología que nos permite conocer cómo usás nuestro sitio. Con esta información, hacemos que sea más fácil usar tu cuenta.
          </p>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-col gap-4 p-6 md:p-8">
          {cookieSettings.map((cookie) => (
            <div 
              key={cookie.id}
              className="flex items-center justify-between rounded-md border border-[#3a3a3a] bg-[#292929] px-6 py-5"
            >
              <div className="flex flex-col pr-4">
                <span className="text-[15px] font-semibold text-white mb-1">
                  {cookie.title}
                </span>
                <span className="text-xs text-[#A8A8AA] leading-relaxed">
                  {cookie.description}
                </span>
              </div>
              <div className="flex-shrink-0 ml-4">
                {/* 
                  El ToggleSwitch visualmente se mantiene con color, 
                  pero idealmente deshabilitamos el evento si está "locked".
                  Dado que ToggleSwitch actualmente no recibe prop "disabled", 
                  simplemente pasamos el initialEnabled. 
                */}
                <ToggleSwitch initialEnabled={cookie.initialEnabled} />
              </div>
            </div>
          ))}
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
