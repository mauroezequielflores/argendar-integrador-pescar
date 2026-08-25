import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, MagnifyingGlassIcon, BellIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Avatar from "../../components/ui/Avatar";
import NotificationCard from "../../components/ui/NotificationCard";

export default function Header({
  logoLink = "/",
  logoText = "Argendar",
  searchPlaceholder = "Buscar profesional o servicio",
  onMobileMenuClick,
  onNotificationClick,
  onSettingsClick,
  userInitials = "A",
  userName = "Apellido Nombre",
  notifications = [], // Nuevo prop para las notificaciones
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationIconClick = () => {
    if (notifications.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    } else if (onNotificationClick) {
      onNotificationClick();
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#292929] bg-[#202020] w-full z-40 relative">
      
      {/* Lado izquierdo */}
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

      {/* Barra de búsqueda */}
      <div className="flex flex-1 items-center px-4 lg:px-0">
        <div className="relative hidden w-full max-w-md sm:block lg:ml-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-[#A8A8AA]" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full rounded-[6px] border border-[#292929] bg-[#292929] py-1.5 pl-10 pr-3 text-sm text-[#FFFFFF] placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none focus:ring-1 focus:ring-[#F78736]"
          />
        </div>
      </div>

      {/* Lado derecho */}
      <div className="flex items-center gap-6 px-4 lg:px-8 shrink-0">
        
        {/* Nombre y Avatar */}
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium lg:block text-white">
            {userName}
          </span>
          <Avatar initials={userInitials} size="sm" />
        </div>

        <div className="h-8 w-px bg-[#292929]" />

        {/* Notificaciones y Configuración */}
        <div className="flex items-center gap-4">
          
          {/* Dropdown de notificaciones */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="text-[#A8A8AA] hover:text-white transition-colors relative flex items-center justify-center"
              onClick={handleNotificationIconClick}
            >
              <BellIcon className="h-6 w-6" />
              {/* Badge si hay notificaciones nuevas (opcional) */}
              {notifications.some(n => n.isNew) && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#F78736] ring-2 ring-[#202020]"></span>
              )}
            </button>

            {/* Menu del Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-[#292929] shadow-lg border border-[#323232] z-50 overflow-hidden">
                <div className="p-4 border-b border-[#323232] flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Notificaciones</h3>
                  <span className="text-xs text-[#A8A8AA] bg-[#323232] px-2 py-1 rounded-md">{notifications.length} nuevas</span>
                </div>
                
                <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n.id} onClick={() => setIsDropdownOpen(false)}>
                      <NotificationCard
                        title={n.titulo}
                        description={n.descripcion}
                        time={n.fecha}
                        icon={n.icon}
                        iconBgColor={n.iconBgColor}
                        iconColor={n.iconColor}
                        isNew={n.isNew}
                        onClick={() => navigate(n.href || "#")}
                      />
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-sm text-[#A8A8AA]">
                      No hay notificaciones.
                    </div>
                  )}
                </div>

                <div className="border-t border-[#323232]">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      if (onNotificationClick) onNotificationClick();
                    }}
                    className="w-full text-center p-3 text-sm font-bold text-[#F78736] hover:bg-[#323232] transition-colors"
                  >
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

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
