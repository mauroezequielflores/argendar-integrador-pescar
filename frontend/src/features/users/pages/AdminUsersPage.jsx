import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import UsersPanel from "../components/UsersPanel";
import { useUsersData } from "../hooks/useUsersData";
import { USERS_TABS } from "../constants/users.constants";
import { ROUTES } from "../../../constants/routes";

/**
 * AdminUsersPage — Pantalla principal de Gestión de Usuarios para el Administrador.
 * Ruta: /admin/users
 *
 * Criterios de Aceptación:
 * - CA01: Acceso a Usuarios, breadcrumb "Inicio / Dashboard", título "Usuarios Argendar" y descripción.
 * - CA02: Contador dinámico de usuarios.
 * - CA03: Pestañas alternables "Profesionales", "Clientes", "Administradores" con ícono + label y subrayado naranja.
 * - CA04: Búsqueda independiente por número de orden en cada panel.
 * - CA05: Listado de usuarios con ID, Nombre, Rol, Fecha, Hora y Acciones.
 * - CA06: Estados de usuario (Activo, Suspendido, Eliminado) con mutación inmediata.
 * - CA07: Estados de carga y Empty States contextualizados.
 * - CA08: Panel Administradores con acciones deshabilitadas (modo solo lectura).
 */
export default function AdminUsersPage() {
  const {
    activeTab,
    setActiveTab,
    searchTerms,
    setSearchTerm,
    filteredUsers,
    handleSuspend,
    handleActivate,
    handleDelete,
    isLoading,
    error,
    refetch,
  } = useUsersData();

  const breadcrumbItems = [
    { label: "Actividad", href: ROUTES.ADMIN_DASHBOARD },
    { label: "Dashboard", href: ROUTES.ADMIN_DASHBOARD },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Breadcrumbs (CA01) ── */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* ── Encabezado Principal (CA01) ── */}
      <div>
        <h1 className="text-2xl font-bold leading-tight text-white">
          Usuarios Argendar
        </h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">
          Gestioná los usuarios registrados en la plataforma.
        </p>
      </div>

      {/* ── Tabs de Navegación por Rol (CA03, CA08) ── */}
      <div className="flex items-center gap-6 border-b border-[#323232]">
        {USERS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 pt-1 text-sm font-semibold transition-colors cursor-pointer ${isActive
                ? "border-b-2 border-[#F78736] text-[#F78736]"
                : "border-b-2 border-transparent text-[#A8A8AA] hover:text-white"
                }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Manejo de Error (CA07) ── */}
      {error && (
        <div
          role="alert"
          className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-[6px] border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={refetch}
            className="flex items-center gap-2 rounded-[6px] bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/30 cursor-pointer"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Reintentar
          </button>
        </div>
      )}

      {/* ── Estado de Carga (CA07) ── */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F78736] border-t-transparent" />
        </div>
      ) : (
        /* ── Panel Activo (CA04, CA05, CA06, CA07, CA08) ── */
        <UsersPanel
          panelKey={activeTab}
          users={filteredUsers}
          searchTerm={searchTerms[activeTab] || ""}
          onSearchChange={setSearchTerm}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
