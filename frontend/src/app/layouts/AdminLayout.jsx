import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ROUTES } from "../../constants/routes";
import Header from "./Header";
import Sidebar from "./Sidebar";

/**
 * AdminLayout — Layout principal del rol Administrador.
 * Ruta base: /admin/*
 *
 * Estructura: Header fijo full-width + Sidebar colapsable + Area de contenido (Outlet).
 * Reutiliza los componentes genericos Header, Sidebar y SidebarItem.
 */
export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Estado desktop colapso
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("¿Estas seguro de que deseas cerrar sesion?")) {
      navigate(ROUTES.LOGIN);
    }
  };

  const closeSidebarMobile = () => setIsSidebarOpen(false);

  // Secciones de navegacion del Administrador
  const sidebarSections = [
    {
      title: "Actividad",
      items: [
        { to: ROUTES.ADMIN_DASHBOARD, icon: HomeIcon, label: "Dashboard" },
        { to: ROUTES.ADMIN_USERS, icon: UsersIcon, label: "Usuarios" },
        { to: ROUTES.ADMIN_TRANSACTIONS, icon: CreditCardIcon, label: "Transacciones" },
        { to: ROUTES.ADMIN_MODERATION, icon: ShieldCheckIcon, label: "Moderacion" },
        { to: ROUTES.ADMIN_REPORTS, icon: ChatBubbleLeftRightIcon, label: "Consultas" },
      ],
    },
    {
      title: "Mi Cuenta",
      items: [
        { to: ROUTES.ADMIN_SETTINGS, icon: Cog6ToothIcon, label: "Configuracion" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#202020] text-[#FFFFFF] font-sans overflow-hidden">
      {/* Header 100% Width */}
      <Header
        logoLink={ROUTES.ADMIN_DASHBOARD}
        logoText="Argendar"
        onMobileMenuClick={() => setIsSidebarOpen(true)}
        onSettingsClick={() => navigate(ROUTES.ADMIN_SETTINGS)}
        userInitials="AN"
        userName="Apellido Nombre"
      />

      {/* Cuerpo Inferior (Sidebar + Contenido) */}
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
          {/* Boton cerrar mobile */}
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

        {/* Area Principal (Outlet) */}
        <main className="flex-1 overflow-y-auto bg-[#202020] p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
