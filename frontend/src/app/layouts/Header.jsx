import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, MagnifyingGlassIcon, BellIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Avatar from "../../components/ui/Avatar";
import NotificationDropdown from "../../features/notifications/components/NotificationDropdown";

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
  onNotificationRead,
  showNotifications = true, // Permite ocultar el ícono de campana (ej. layout admin)
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
    setIsDropdownOpen((isOpen) => !isOpen);
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#404040] bg-[#202020] w-full z-40 relative">

      {/* Lado izquierdo */}
      <div className="flex items-center gap-4 w-auto lg:w-67 shrink-0 px-3 lg:px-7">
        {onMobileMenuClick && (
          <button
            onClick={onMobileMenuClick}
            className="text-[#A8A8AA] hover:text-white lg:hidden"
          >
            <Bars3Icon className="h-7 w-7" />
          </button>
        )}
        <Link to={logoLink} className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-6 w-6 rounded-md object-contain" />
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
            <MagnifyingGlassIcon className="h-4 w-4 text-[#A8A8AA]" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full rounded-[20px] border border-[#404040] py-1.5 pl-10 pr-3 text-xs text-[#FFFFFF] placeholder-[#A8A8AA] bg-[#292929] focus:border-[#F78736] focus:outline-none focus:ring-1 focus:ring-[#F78736]"
          />
        </div>
      </div>

      {/* Lado derecho */}
      <div className="flex items-center gap-6 px-4 lg:px-8 shrink-0">

        {/* Nombre y Avatar */}
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium lg:block text-white">
            {userName}
          </span>
          <Avatar initials={userInitials} size="sm" />
        </div>

        <div className="h-8 w-px bg-[#292929]" />

        {/* Notificaciones y Configuración */}
        <div className="flex items-center gap-4">

          {/* Dropdown de notificaciones — se oculta cuando showNotifications=false */}
          {showNotifications && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="text-[#A8A8AA] hover:text-white transition-colors relative flex items-center justify-center"
                onClick={handleNotificationIconClick}
              >
                <BellIcon className="h-6 w-6" />
                {/* Badge si hay notificaciones nuevas */}
                {notifications.some(n => n.isNew) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#F78736] ring-2 ring-[#202020]"></span>
                )}
              </button>

              {/* Menu del Dropdown */}
              {isDropdownOpen && (
                <NotificationDropdown
                  notifications={notifications}
                  onClose={() => setIsDropdownOpen(false)}
                  onRead={onNotificationRead}
                  onViewAll={() => {
                    setIsDropdownOpen(false);
                    onNotificationClick?.();
                  }}
                />
              )}
            </div>
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
