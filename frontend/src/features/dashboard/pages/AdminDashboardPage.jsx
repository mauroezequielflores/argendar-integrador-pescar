import { useState } from "react";
import {
  UserGroupIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CreditCardIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import StatCard from "../../../components/ui/StatCard";
import RecentActivityCard from "../components/RecentActivityCard";
import { useDashboardData } from "../hooks/useDashboardData";
import { mockRecentActivity } from "../data/mockDashboardData";

/**
 * AdminDashboardPage — Pantalla principal de Dashboard General para Administrador.
 * Ruta: /admin/dashboard
 *
 * Criterios de Aceptación:
 * - CA01: Acceso al dashboard con breadcrumbs "Inicio / Dashboard", título y descripción.
 * - CA02: Tarjetas de métricas globales (Usuarios, Solicitudes activas, Ofertas realizadas, Transacciones).
 * - CA03: Bloque "Actividad Reciente" con tabla de eventos o Empty State idéntico al diseño.
 * - CA04: Manejo de errores con reintento y estados de carga.
 */
export default function AdminDashboardPage() {
  const [showSampleData, setShowSampleData] = useState(false);
  const { metrics, activities, isLoading, error, refetch } = useDashboardData({
    initialEmpty: true,
  });

  // Breadcrumbs según captura de referencia
  const breadcrumbItems = [
    { label: "Inicio", href: "/admin/dashboard" },
    { label: "Dashboard" },
  ];

  // Si showSampleData está activado, mostramos los mocks para verificar CA03
  const displayedActivities = showSampleData ? mockRecentActivity : activities;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Breadcrumbs ────────────────────────────────────────── */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* ── Encabezado Principal ──────────────────────────────── */}
      <div>
        <h1 className="text-[32px] font-bold leading-tight text-white">
          Dashboard Argendar
        </h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">
          Resumen de actividad global, usuarios registrados y servicios activados.
        </p>
      </div>

      {/* ── Línea divisoria ───────────────────────────────────── */}
      <div className="h-px w-full bg-[#292929]" />

      {/* ── Manejo de Error (CA04) ─────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-[12px] border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
        >
          <span>{error}</span>
          <button
            onClick={refetch}
            className="flex items-center gap-2 rounded-[6px] bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/30"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Reintentar
          </button>
        </div>
      )}

      {/* ── Tarjetas de Métricas Globales (CA02) ──────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={UserGroupIcon}
          label="USUARIOS"
          value={metrics.usuarios}
        />
        <StatCard
          icon={DocumentTextIcon}
          label="SOLICITUDES ACTIVAS"
          value={metrics.solicitudesActivas}
        />
        <StatCard
          icon={DocumentDuplicateIcon}
          label="OFERTAS REALIZADAS"
          value={metrics.ofertasRealizadas}
        />
        <StatCard
          icon={CreditCardIcon}
          label="TRANSACCIONES"
          value={metrics.transacciones}
        />
      </div>

      {/* ── Sección de Actividad Reciente (CA03) ────────────────── */}
      <RecentActivityCard
        activities={displayedActivities}
        isLoading={isLoading}
        onViewAll={() => setShowSampleData(!showSampleData)}
      />
    </div>
  );
}
