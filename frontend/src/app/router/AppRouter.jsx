import { Routes, Route, Navigate } from "react-router-dom";

import { ROUTES } from "../../constants/routes";
import { ROLES } from "../../constants/roles";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Auth
import LoginPage from "../../features/auth/pages/LoginPage";
import RoleSelectionPage from "../../features/auth/pages/RoleSelectionPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";

// Home pages por rol
import ClientHomePage from "../../features/home/pages/ClientHomePage";
import ProfessionalHomePage from "../../features/home/pages/ProfessionalHomePage";
import AdminHomePage from "../../features/home/pages/AdminHomePage";

// Layouts & Client Pages
import ClientLayout from "../layouts/ClientLayout";
import AgendaPage from "../../features/agenda/pages/AgendaPage";
import NotificationsPage from "../../features/notifications/pages/NotificationsPage";
import MarketplacePage from "../../features/marketplace/pages/MarketplacePage";
import ProfilePage from "../../features/profile/pages/ProfilePage";
import EditProfilePage from "../../features/profile/pages/EditProfilePage";
import ProfileSettingsPage from "../../features/profile/pages/ProfileSettingsPage";
import EditProfileSettingsPage from "../../features/profile/pages/EditProfileSettingsPage";
import ProfilePrivacyPage from "../../features/profile/pages/ProfilePrivacyPage";
import PaymentMethodsPage from "../../features/profile/pages/PaymentMethodsPage";
import SettingsPage from "../../features/configurations/pages/SettingsPage";
import HelpPage from "../../features/help/pages/HelpPage";

/**
 * AppRouter — Árbol de rutas principal de Argendar.
 *
 * Estructura:
 *  / → redirige a /login
 *  /login
 *  /role
 *  /register/:role  (client | professional)
 *
 *  /client/*        → requiere auth + rol CLIENTE
 *  /professional/*  → requiere auth + rol PROFESIONAL
 *  /admin/*         → requiere auth + rol ADMINISTRADOR
 */
export default function AppRouter() {
  return (
    <Routes>
      {/* Redirect raíz */}
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

      {/* ── Auth (públicas) ─────────────────────────────────── */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ROLE_SELECTION} element={<RoleSelectionPage />} />
      <Route path="/register/:role" element={<RegisterPage />} />

      {/* ── Cliente ─────────────────────────────────────────── */}
      <Route
        path="/client/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.CLIENTE]}>
              <ClientLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/edit-profile" element={<EditProfilePage />} />
        <Route path="profile/profile-settings" element={<ProfileSettingsPage />} />
        <Route path="profile/profile-settings/edit-profile-settings" element={<EditProfileSettingsPage />} />
        <Route path="profile/profile-privacy" element={<ProfilePrivacyPage />} />
        <Route path="profile/payment-methods" element={<PaymentMethodsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="home" element={<ClientHomePage />} />
        <Route path="*" element={<Navigate to="/client/agenda" replace />} />
      </Route>

      {/* ── Profesional ─────────────────────────────────────── */}
      <Route
        path="/professional/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.PROFESIONAL]}>
              <Routes>
                <Route path="home" element={<ProfessionalHomePage />} />
                {/* Agregar más rutas de profesional aquí */}
                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* ── Administrador ───────────────────────────────────── */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.ADMINISTRADOR]}>
              <Routes>
                <Route path="home" element={<AdminHomePage />} />
                {/* Agregar más rutas de admin aquí */}
                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#292929] text-white">
            <p className="text-5xl font-bold text-[#FD7B03]">404</p>
            <p className="text-lg font-semibold">Página no encontrada</p>
            <a
              href={ROUTES.LOGIN}
              className="mt-2 rounded-[6px] bg-[#FD7B03] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#e06d00] transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        }
      />
    </Routes>
  );
}
