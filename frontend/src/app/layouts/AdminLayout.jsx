import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  InboxIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

/**
 * AdminLayout — Estructura visual compartida del rol Administrador.
 *
 * Incluye Header y Sidebar con las secciones de la captura de diseño:
 * - GENERAL (primera imagen) o ACTIVIDAD (resto de imágenes)
 *   → Dashboard, Usuarios, Transacciones, Moderación, Bandeja de consultas
 * - MI CUENTA → Configuración
 * - Cerrar sesión
 */
export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
      navigate(ROUTES.LOGIN);
    }
  };

  const closeSidebarMobile = () => setIsSidebarOpen(false);

  // Secciones del menú lateral según capturas de diseño del Administrador
  const sidebarSections = [
    {
      title: "ACTIVIDAD",
      items: [
        { to: ROUTES.ADMIN_DASHBOARD, icon: HomeIcon, label: "Dashboard" },
        { to: ROUTES.ADMIN_USERS, icon: UserGroupIcon, label: "Usuarios" },
        { to: ROUTES.ADMIN_TRANSACTIONS, icon: CreditCardIcon, label: "Transacciones" },
        { to: ROUTES.ADMIN_MODERATION, icon: ShieldCheckIcon, label: "Moderación" },
        { to: ROUTES.ADMIN_INBOX, icon: InboxIcon, label: "Bandeja de consultas" },
      ],
    },
    {
      title: "MI CUENTA",
      items: [
        { to: ROUTES.ADMIN_SETTINGS, icon: Cog6ToothIcon, label: "Configuración" },
      ],
    },
  ];

  // Nombre de display del administrador según captura: "Apellido Nombre"
  const displayName = user
    ? `${user.lastName || ""} ${user.name || ""}`.trim()
    : "Apellido Nombre";

  const initials = user?.lastName
    ? user.lastName.charAt(0).toUpperCase()
    : "A";

  return (
    <div className="flex flex-col h-screen bg-[#202020] text-[#FFFFFF] font-sans overflow-hidden">
      {/* ── Header ────────────────────────────────────────────── */}
      <Header
        logoLink={ROUTES.ADMIN_DASHBOARD}
        logoText="Argendar"
        onMobileMenuClick={() => setIsSidebarOpen(true)}
        onSettingsClick={() => navigate(ROUTES.ADMIN_SETTINGS)}
        userInitials={initials}
        userName={displayName}
        showNotifications={false}
      />

      {/* ── Cuerpo: Sidebar + Contenido ───────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay Mobile */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeSidebarMobile}
        />

        {/* Contenedor del Sidebar */}
        <div
          className={`absolute lg:relative inset-y-0 left-0 z-50 transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Botón cerrar mobile */}
          <div className="flex h-12 items-center justify-end px-4 lg:hidden bg-[#202020] border-r border-[#292929]">
            <button onClick={closeSidebarMobile} className="text-[#A8A8AA] hover:text-white">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            sections={sidebarSections}
            onLogout={handleLogout}
            onMobileClose={closeSidebarMobile}
          />
        </div>

        {/* Área de Contenido Principal */}
        <main className="flex-1 overflow-y-auto bg-[#202020] p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
