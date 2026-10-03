import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CreditCardIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import StatCard from "../../../components/ui/StatCard";
import MarketplaceActivityCard from "../components/MarketplaceActivityCard";
import RecentActivityCard from "../components/RecentActivityCard";
import { useDashboardData } from "../hooks/useDashboardData";
import { mockRecentActivity } from "../data/mockDashboardData";
import { ROUTES } from "../../../constants/routes";

/**
 * AdminDashboardPage — Pantalla principal de Dashboard General para Administrador.
 * Ruta: /admin/dashboard
 *
 * Criterios de Aceptación:
 * - CA01: Acceso al dashboard con breadcrumbs "Actividad / Dashboard", título y descripción.
 * - CA02: Tarjetas de métricas globales con mini gráficos de tendencia.
 * - CA03: Sección "Actividad de Marketplace" con gráfico de línea continuo.
 * - CA04: Sección "Actividad reciente" con Empty State o listado de eventos.
 * - CA05: Navegación de la barra lateral integrada.
 * - CA06: Manejo de errores con reintento y estados de carga.
 */
export default function AdminDashboardPage() {
  const [showSampleData, setShowSampleData] = useState(false);
  const navigate = useNavigate();
  const { metrics, marketplaceData, activities, isLoading, error, refetch } = useDashboardData({
    initialEmpty: true,
  });

  // Breadcrumbs según CA01 y captura de referencia ("Actividad / Dashboard")
  const breadcrumbItems = [
    { label: "Actividad", href: ROUTES.ADMIN_DASHBOARD },
    { label: "Dashboard" },
  ];

  // Si showSampleData está activado (mediante "Ver todo"), mostramos los eventos mock
  const displayedActivities = showSampleData ? mockRecentActivity : activities;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Breadcrumbs (CA01) ─────────────────────────────────── */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* ── Encabezado Principal (CA01) ────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold leading-tight text-white">
          Dashboard Argendar
        </h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">
          Resumen de actividad global, usuarios registrados y servicios activados.
        </p>
      </div>

      {/* ── Línea divisoria ───────────────────────────────────── */}
      <div className="h-px w-full bg-[#292929]" />

      {/* ── Manejo de Error (CA06) ─────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-[6px] border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
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
          trendBars={metrics.usuariosTrend}
          onClick={() => navigate(ROUTES.ADMIN_USERS)}
        />
        <StatCard
          icon={DocumentTextIcon}
          label="SOLICITUDES ACTIVAS"
          value={metrics.solicitudesActivas}
          trendBars={metrics.solicitudesTrend}
          onClick={() => navigate(ROUTES.ADMIN_MODERATION)}
        />
        <StatCard
          icon={DocumentDuplicateIcon}
          label="OFERTAS REALIZADAS"
          value={metrics.ofertasRealizadas}
          trendBars={metrics.ofertasTrend}
          onClick={() => navigate(ROUTES.ADMIN_MODERATION)}
        />
        <StatCard
          icon={CreditCardIcon}
          label="TRANSACCIONES"
          value={metrics.transacciones}
          trendBars={metrics.transaccionesTrend}
          onClick={() => navigate(ROUTES.ADMIN_TRANSACTIONS)}
        />
      </div>

      {/* ── Sección de Actividad de Marketplace (CA03) ──────────── */}
      <MarketplaceActivityCard
        data={marketplaceData}
        isLoading={isLoading}
      />

      {/* ── Sección de Actividad Reciente (CA04) ────────────────── */}
      <RecentActivityCard
        activities={displayedActivities}
        isLoading={isLoading}
        onViewAll={() => setShowSampleData(!showSampleData)}
      />
    </div>
  );
}
