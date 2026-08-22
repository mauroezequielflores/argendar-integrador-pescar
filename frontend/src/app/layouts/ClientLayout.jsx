import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  CalendarIcon,
  BellIcon,
  BuildingStorefrontIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ROUTES } from "../../constants/routes";

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-[6px] px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-[#292929] text-[#FFFFFF]"
            : "text-[#A8A8AA] hover:bg-[#323232] hover:text-[#FFFFFF]"
        }`
      }
    >
      <Icon className="h-5 w-5" />
      {label}
    </NavLink>
  );
};

export default function ClientLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Aquí iría la lógica real de logout o confirmación. Por ahora solo redirigimos.
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      navigate(ROUTES.LOGIN);
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-[#202020] text-[#FFFFFF] font-sans">
      {/* ── Sidebar (Desktop) / Overlay (Mobile) ───────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-[#292929] bg-[#202020] transition-transform duration-300 lg:static lg:flex lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 lg:hidden">
          <Link to="/client/agenda" className="text-xl font-bold text-[#F78736]" onClick={closeSidebar}>
            Argendar
          </Link>
          <button onClick={closeSidebar} className="text-[#A8A8AA] hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <nav className="flex-1 space-y-6">
            <div>
              <p className="mb-2 px-3 text-xs font-semibold text-[#A8A8AA] uppercase tracking-wider">
                Actividad
              </p>
              <div className="space-y-1">
                <SidebarItem to="/client/agenda" icon={CalendarIcon} label="Mi Agenda" onClick={closeSidebar} />
                <SidebarItem to="/client/notifications" icon={BellIcon} label="Notificaciones" onClick={closeSidebar} />
              </div>
            </div>

            <div>
              <p className="mb-2 px-3 text-xs font-semibold text-[#A8A8AA] uppercase tracking-wider">
                Descubrir
              </p>
              <div className="space-y-1">
                <SidebarItem to="/client/marketplace" icon={BuildingStorefrontIcon} label="Marketplace" onClick={closeSidebar} />
              </div>
            </div>

            <div>
              <p className="mb-2 px-3 text-xs font-semibold text-[#A8A8AA] uppercase tracking-wider">
                Mi Cuenta
              </p>
              <div className="space-y-1">
                <SidebarItem to="/client/profile" icon={UserIcon} label="Mi perfil" onClick={closeSidebar} />
                <SidebarItem to="/client/settings" icon={Cog6ToothIcon} label="Configuración" onClick={closeSidebar} />
              </div>
            </div>

            <div>
              <p className="mb-2 px-3 text-xs font-semibold text-[#A8A8AA] uppercase tracking-wider">
                Soporte
              </p>
              <div className="space-y-1">
                <SidebarItem to="/client/help" icon={QuestionMarkCircleIcon} label="Ayuda" onClick={closeSidebar} />
              </div>
            </div>
          </nav>

          <div className="mt-8 border-t border-[#292929] pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-[6px] px-3 py-2 text-sm font-medium text-[#A8A8AA] transition-colors hover:bg-[#323232] hover:text-[#FFFFFF]"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* ── Contenido Principal ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#292929] bg-[#202020] px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-[#A8A8AA] hover:text-white lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Link to="/client/agenda" className="hidden text-xl font-bold text-[#F78736] lg:block">
              Argendar
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden w-64 sm:block lg:w-80">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-[#A8A8AA]" />
              </div>
              <input
                type="text"
                placeholder="Buscar"
                className="w-full rounded-[6px] border border-[#292929] bg-[#292929] py-1.5 pl-10 pr-3 text-sm text-[#FFFFFF] placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none focus:ring-1 focus:ring-[#F78736]"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                className="text-[#A8A8AA] hover:text-white"
                onClick={() => navigate("/client/notifications")}
              >
                <BellIcon className="h-6 w-6" />
              </button>
              
              <div className="h-8 w-px bg-[#292929]" />
              
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F78736] text-sm font-bold text-white">
                  JD
                </div>
                <span className="hidden text-sm font-medium lg:block">
                  Doe John
                </span>
              </div>
              
              <button
                className="text-[#A8A8AA] hover:text-white"
                onClick={() => navigate("/client/settings")}
              >
                <Cog6ToothIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Área de Outlet donde cargan las vistas hijas */}
        <main className="flex-1 overflow-y-auto bg-[#202020] p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
