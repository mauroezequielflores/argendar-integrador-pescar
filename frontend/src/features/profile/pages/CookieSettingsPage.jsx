import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

/* ── Toggle switch ──────────────────────────────────────────────── */
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer focus-visible:ring-2 focus-visible:ring-[#F78736]"
      } ${checked ? "bg-[#F78736]" : "bg-[#323232]"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ── Fila de cookie ─────────────────────────────────────────────── */
function CookieRow({ titulo, descripcion, checked, onChange, disabled }) {
  return (
    <div className="flex items-start justify-between gap-6 rounded-lg border border-[#323232] bg-[#292929] p-5">
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{titulo}</p>
        <p className="mt-1 text-xs leading-relaxed text-[#A8A8AA]">{descripcion}</p>
      </div>
      <div className="pt-0.5">
        <Toggle checked={checked} onChange={onChange} disabled={disabled} />
      </div>
    </div>
  );
}

/* ── Estado inicial de cookies ──────────────────────────────────── */
const INITIAL_STATE = {
  analiticas: true,
  rendimiento: false,
  funcionales: true,
};

/* ── Pantalla principal ─────────────────────────────────────────── */
export default function CookieSettingsPage() {
  const navigate = useNavigate();
  const [cookies, setCookies] = useState(INITIAL_STATE);

  const set = (key) => (value) => setCookies((prev) => ({ ...prev, [key]: value }));

  const handleBack = () => navigate("/professional/profile/profile-privacy");

  const handleCancel = () => {
    setCookies(INITIAL_STATE);
    navigate("/professional/profile/profile-privacy");
  };

  return (
    <div className="flex w-full flex-col gap-4 p-6">
      {/* CA01 — Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#A8A8AA]">
        <span
          className="cursor-pointer transition-colors hover:text-white"
          onClick={() => navigate("/professional/profile")}
        >
          Mi perfil
        </span>
        <span>›</span>
        <span
          className="cursor-pointer transition-colors hover:text-white"
          onClick={handleBack}
        >
          Privacidad
        </span>
        <span>›</span>
        <span className="font-medium text-white">Configurar cookies</span>
      </nav>

      {/* Contenedor principal */}
      <div className="rounded-lg border border-[#323232] bg-[#292929]">
        {/* Título */}
        <div className="border-b border-[#323232] p-6 pb-5">
          <h1 className="text-xl font-semibold text-white">Configurar cookies</h1>
          <p className="mt-1 text-xs leading-relaxed text-[#A8A8AA]">
            Las cookies son una tecnología que nos permite conocer cómo usás nuestro sitio.
            Con esta información, hacemos que sea más fácil usar tu cuenta.
          </p>
        </div>

        {/* CA02/CA03 — Tipos de cookies */}
        <div className="flex flex-col gap-3 p-6">
          <CookieRow
            titulo="Cookies esenciales"
            descripcion="Sirven para reconocerte cuando ingresás, guardar tus preferencias de configuración y proteger tu cuenta. No pueden deshabilitarse porque son necesarias para el funcionamiento de nuestro sitio."
            checked={true}
            onChange={() => {}}
            disabled={true}
          />
          <CookieRow
            titulo="Cookies analíticas"
            descripcion="Nos permiten analizar tu navegación en el sitio para que podamos mejorar nuestros servicios."
            checked={cookies.analiticas}
            onChange={set("analiticas")}
          />
          <CookieRow
            titulo="Cookies de rendimiento"
            descripcion="Nos permiten optimizar algunas funciones de nuestro sitio."
            checked={cookies.rendimiento}
            onChange={set("rendimiento")}
          />
          <CookieRow
            titulo="Cookies funcionales"
            descripcion="Nos permiten mantener el buen funcionamiento de nuestro sitio."
            checked={cookies.funcionales}
            onChange={set("funcionales")}
          />
        </div>
      </div>

      {/* CA04 — Botones footer */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-md border border-[#727272] bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#292929]"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Volver
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-2 rounded-md border border-[#727272] bg-transparent px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#292929]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
