import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

/* ── Toggle switch ──────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78736] ${
        checked ? "bg-[#F78736]" : "bg-[#323232]"
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

/* ── Fila de configuración con switch ───────────────────────────── */
function SettingRowToggle({ titulo, descripcion, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-lg border border-[#323232] bg-[#292929] px-6 py-5">
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{titulo}</p>
        <p className="mt-0.5 text-xs text-[#A8A8AA]">{descripcion}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

/* ── Fila de configuración con dropdown estático ────────────────── */
function SettingRowDropdown({ titulo, descripcion, valor }) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-lg border border-[#323232] bg-[#292929] px-6 py-5">
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{titulo}</p>
        <p className="mt-0.5 text-xs text-[#A8A8AA]">{descripcion}</p>
      </div>
      {/* Dropdown visual — solo lectura en esta iteración */}
      <div className="inline-flex cursor-default items-center gap-2 rounded-md border border-[#323232] bg-[#323232] px-3 py-1.5 text-xs text-white">
        <span>{valor}</span>
        <ChevronDownIcon className="h-3.5 w-3.5 text-[#A8A8AA]" />
      </div>
    </div>
  );
}

/* ── Pantalla principal ─────────────────────────────────────────── */
export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta el rol desde la URL para el breadcrumb "Inicio"
  const match = location.pathname.match(/^\/(professional|client)/);
  const prefix = match ? `/${match[1]}` : null;
  const homePath = prefix ? `${prefix}/agenda` : "/";

  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="flex w-full flex-col gap-4 p-6">
      {/* CA01 — Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#A8A8AA]">
        <span
          className="cursor-pointer transition-colors hover:text-white"
          onClick={() => navigate(homePath)}
        >
          Inicio
        </span>
        <span>›</span>
        <span className="font-medium text-white">Configuración</span>
      </nav>

      {/* Título y descripción */}
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="mt-1 text-xs text-[#A8A8AA]">
          Administrá tus configuraciones de cuenta.
        </p>
      </div>

      {/* Tab "General" con subrayado naranja */}
      <div className="border-b border-[#323232]">
        <button
          type="button"
          className="inline-flex items-center gap-2 border-b-2 border-[#F78736] pb-2 text-sm font-medium text-white"
        >
          <ClipboardDocumentListIcon className="h-4 w-4" />
          General
        </button>
      </div>

      {/* CA02 — Modo claro / nocturno */}
      <SettingRowToggle
        titulo="Cambiar a modo claro o nocturno"
        descripcion="Elegí el tema visual que mejor se adapte a tu entorno de trabajo."
        checked={darkMode}
        onChange={setDarkMode}
      />

      {/* CA03 — Idioma */}
      <SettingRowDropdown
        titulo="Idioma de la plataforma"
        descripcion="Seleccioná el idioma en el que deseas visualizar la aplicación."
        valor="Español (Argentina)"
      />

      {/* CA04 — Zona horaria */}
      <SettingRowDropdown
        titulo="Zona horaria"
        descripcion="Ajuste automático según tu ubicación para recordatorios y citas."
        valor="(GMT-03:00) Buenos Aires"
      />
    </div>
  );
}
