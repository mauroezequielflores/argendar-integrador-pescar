import { Link } from "react-router-dom";
import { Bars3Icon, MagnifyingGlassIcon, BellIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Avatar from "./Avatar";

export default function Header({
  logoLink = "/",
  logoText = "Argendar",
  onMobileMenuClick,
  onNotificationClick,
  onSettingsClick,
  userInitials = "U",
  userName = "Usuario",
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#292929] bg-[#202020] w-full z-10 relative">
      
      {/* 1. y 2. Icono y Argendar - Ocupa el ancho exacto del sidebar en desktop (w-64) */}
      <div className="flex items-center gap-4 w-auto lg:w-64 shrink-0 px-4 lg:px-8">
        {onMobileMenuClick && (
          <button
            onClick={onMobileMenuClick}
            className="text-[#A8A8AA] hover:text-white lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        )}
        <Link to={logoLink} className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-md object-contain" />
          <span className="text-xl font-bold">
            <span className="text-[#F78736]">Argen</span>
            <span className="text-white">dar</span>
          </span>
        </Link>
      </div>

      {/* 3. Barra de búsqueda - Comienza luego del sidebar (flex-1) */}
      <div className="flex flex-1 items-center px-4 lg:px-0">
        <div className="relative hidden w-full max-w-md sm:block lg:ml-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-[#A8A8AA]" />
          </div>
          <input
            type="text"
            placeholder="Buscar"
            className="w-full rounded-[6px] border border-[#292929] bg-[#292929] py-1.5 pl-10 pr-3 text-sm text-[#FFFFFF] placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none focus:ring-1 focus:ring-[#F78736]"
          />
        </div>
      </div>

      {/* Lado derecho - Orden: Nombre, Avatar, Campana, Configuración */}
      <div className="flex items-center gap-6 px-4 lg:px-8 shrink-0">
        
        {/* 4. y 5. Apellido Nombre y Avatar */}
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium lg:block text-white">
            {userName}
          </span>
          <Avatar initials={userInitials} size="sm" />
        </div>

        <div className="h-8 w-px bg-[#292929]" />

        {/* 6. y 7. Iconos de notificaciones y configuración */}
        <div className="flex items-center gap-4">
          {onNotificationClick && (
            <button className="text-[#A8A8AA] hover:text-white transition-colors" onClick={onNotificationClick}>
              <BellIcon className="h-6 w-6" />
            </button>
          )}

          {onSettingsClick && (
            <button className="text-[#A8A8AA] hover:text-white transition-colors" onClick={onSettingsClick}>
              <Cog6ToothIcon className="h-6 w-6" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
