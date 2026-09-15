import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  BellIcon,
  BuildingStorefrontIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatbotWidget from "../../components/ui/ChatbotWidget";
import LogoutModal from "../../components/ui/LogoutModal";
import { mockClientHeaderNotifications } from "../../features/notifications/data/mockClientNotifications";
import { api } from "../../libs/axios";

export default function ClientLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop collapse state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [headerNotifications, setHeaderNotifications] = useState(mockClientHeaderNotifications);
  const [userProfile, setUserProfile] = useState({ firstName: "", lastName: "", avatarUrl: null });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await api.get('/client/profile');
      setUserProfile({
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        avatarUrl: response.data.avatarUrl || null
      });
    } catch (error) {
      console.error("Error fetching client profile for header:", error);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    if (logout) logout();
    navigate(ROUTES.LOGIN);
  };

  const closeSidebarMobile = () => setIsSidebarOpen(false);

  // Definición de las secciones de navegación del cliente
  const sidebarSections = [
    {
      title: "Actividad",
      items: [
        { to: "/client/agenda", icon: CalendarIcon, label: "Mi Agenda" },
        { to: "/client/notifications", icon: BellIcon, label: "Notificaciones" },
      ],
    },
    {
      title: "Descubrir",
      items: [
        { to: "/client/marketplace", icon: BuildingStorefrontIcon, label: "Marketplace" },
      ],
    },
    {
      title: "Mi Cuenta",
      items: [
        { to: "/client/profile", icon: UserIcon, label: "Mi perfil" },
        { to: "/client/settings", icon: Cog6ToothIcon, label: "Configuración" },
      ],
    },
    {
      title: "Soporte",
      items: [
        { to: "/client/help", icon: QuestionMarkCircleIcon, label: "Ayuda" },
      ],
    },
  ];

  const userName = userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName}`.trim() : "Cargando...";
  const userInitials = userProfile.firstName ? userProfile.firstName[0].toUpperCase() : "U";

  return (
    <div className="flex flex-col h-screen bg-[#202020] text-[#FFFFFF] font-sans overflow-hidden">
      {/* ── Header 100% Width ────────────────────────────────────── */}
      <Header
        logoLink="/client/agenda"
        logoText="Argendar"
        onMobileMenuClick={() => setIsSidebarOpen(true)}
        onNotificationClick={() => navigate("/client/notifications")}
        onSettingsClick={() => navigate("/client/settings")}
        notifications={headerNotifications}
        onNotificationRead={(notificationId) => {
          setHeaderNotifications((currentNotifications) =>
            currentNotifications.map((notification) =>
              notification.id === notificationId ? { ...notification, isNew: false } : notification,
            ),
          );
        }}
        userInitials={userInitials}
        userName={userName}
        avatarUrl={userProfile.avatarUrl}
      />

      {/* ── Cuerpo Inferior (Sidebar + Contenido) ────────────────── */}
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
          {/* Botón cerrar mobile dentro del contenedor del sidebar pero arriba */}
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

        {/* Área Principal (Outlet) */}
        <main className="flex-1 overflow-y-auto bg-[#202020] p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
      <ChatbotWidget role="client" />

      {/* ── Modal de Confirmación de Cierre de Sesión ─────────────── */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
