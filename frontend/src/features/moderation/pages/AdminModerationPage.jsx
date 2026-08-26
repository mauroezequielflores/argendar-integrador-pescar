import { useState } from "react";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import ModerationTabs from "../components/ModerationTabs";
import ModerationPanel from "../components/ModerationPanel";
import { ROUTES } from "../../../constants/routes";

/**
 * Definición de los cuatro paneles según la historia de usuario (CA02).
 * El orden y los labels coinciden con las capturas de diseño.
 */
const TABS = [
  { key: "solicitudes", label: "Solicitudes" },
  { key: "ofertas", label: "Ofertas" },
  { key: "calificaciones", label: "Calificaciones" },
  { key: "turnos", label: "Turnos" },
];

/**
 * AdminModerationPage — Pantalla de Moderación para el Administrador.
 * Ruta: /admin/moderation
 *
 * Criterios de Aceptación:
 * - CA01: Título "Moderación" y descripción introductoria.
 * - CA02: Cuatro paneles alternables (Solicitudes, Ofertas, Calificaciones, Turnos).
 *         Panel por defecto: "Solicitudes".
 * - CA03: Barra de búsqueda por número de orden en cada panel.
 * - CA04: Tarjetas con ID, estado, título, descripción, usuario y tres acciones.
 * - CA05: Cambio de estado inmediato (Activo / Desactivado / Eliminado).
 * - CA06: Empty state contextualizado y manejo de error con reintento.
 */
export default function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState("solicitudes");

  const breadcrumbItems = [
    { label: "Inicio", href: ROUTES.ADMIN_DASHBOARD },
    { label: "Dashboard", href: ROUTES.ADMIN_DASHBOARD },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Breadcrumbs (CA01) ──────────────────────────────── */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* ── Encabezado de sección (CA01) ────────────────────── */}
      <div>
        <h1 className="text-[32px] font-bold leading-tight text-white">
          Moderación
        </h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">
          Gestiona y controla el contenido publicado por clientes y profesionales en la plataforma.
        </p>
      </div>

      {/* ── Tabs (CA02) ─────────────────────────────────────── */}
      <ModerationTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* ── Panel activo (CA03, CA04, CA05, CA06) ───────────── */}
      {TABS.map((tab) =>
        activeTab === tab.key ? (
          <div
            key={tab.key}
            id={`panel-${tab.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.key}`}
          >
            <ModerationPanel panelKey={tab.key} />
          </div>
        ) : null
      )}
    </div>
  );
}
