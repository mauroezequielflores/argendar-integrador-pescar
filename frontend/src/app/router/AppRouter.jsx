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

// Layouts
import ClientLayout from "../layouts/ClientLayout";
import ProfessionalLayout from "../layouts/ProfessionalLayout";
import AdminLayout from "../layouts/AdminLayout";

// Admin pages
import AdminModerationPage from "../../features/moderation/pages/AdminModerationPage";

import AgendaPage from "../../features/agenda/pages/AgendaPage";
import CreateRequestPage from "../../features/agenda/pages/CreateRequestPage";
import CreateRequestLocationPage from "../../features/agenda/pages/CreateRequestLocationPage";
import CreateRequestRevisionPage from "../../features/agenda/pages/CreateRequestRevisionPage";
import CreateRequestLayout from "../../features/agenda/layouts/CreateRequestLayout";
import { CreateRequestProvider } from "../../features/agenda/context/CreateRequestContext";
import ProfessionalAgendaPage from "../../features/agenda/pages/ProfessionalAgendaPage";
import ProfessionalNotificationsPage from "../../features/notifications/pages/ProfessionalNotificationsPage";
import OfferDetailsPage from "../../features/notifications/pages/OfferDetailsPage";
import ReminderDetailsPage from "../../features/notifications/pages/ReminderDetailsPage";
import CancellationDetailsPage from "../../features/notifications/pages/CancellationDetailsPage";
import PaymentConfirmedDetailsPage from "../../features/notifications/pages/PaymentConfirmedDetailsPage";
import ReviewDetailsPage from "../../features/notifications/pages/ReviewDetailsPage";
import ProfessionalMarketplacePage from "../../features/marketplace/pages/ProfessionalMarketplacePage";
import ProfessionalHelpPage from "../../features/help/pages/ProfessionalHelpPage";
import ProfessionalProfilePage from "../../features/profile/pages/ProfessionalProfilePage";
import EditProfessionalProfilePage from "../../features/profile/pages/EditProfessionalProfilePage";
import NotificationsPage from "../../features/notifications/pages/NotificationsPage";
import MarketplacePage from "../../features/marketplace/pages/MarketplacePage";
import ProfilePage from "../../features/profile/pages/ProfilePage";
import EditProfilePage from "../../features/profile/pages/EditProfilePage";
import ProfileSettingsPage from "../../features/profile/pages/ProfileSettingsPage";
import EditProfileSettingsPage from "../../features/profile/pages/EditProfileSettingsPage";
import ProfilePrivacyPage from "../../features/profile/pages/ProfilePrivacyPage";
import ManagePrivacyPage from "../../features/profile/pages/ManagePrivacyPage";
import CookieSettingsPage from "../../features/profile/pages/CookieSettingsPage";
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
        
        {/* Flujo de Creación de Solicitud envuelto en su Layout */}
        <Route element={<CreateRequestLayout />}>
          <Route path="agenda/create-request" element={<CreateRequestPage />} />
          <Route path="agenda/create-request/location" element={<CreateRequestLocationPage />} />
          <Route path="agenda/create-request/revision" element={<CreateRequestRevisionPage />} />
        </Route>

        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/edit-profile" element={<EditProfilePage />} />
        <Route path="profile/profile-settings" element={<ProfileSettingsPage />} />
        <Route path="profile/profile-settings/edit-profile-settings" element={<EditProfileSettingsPage />} />
        <Route path="profile/profile-privacy" element={<ProfilePrivacyPage />} />
        <Route path="profile/profile-privacy/manage-privacy" element={<ManagePrivacyPage />} />
        <Route path="profile/profile-privacy/cookie-settings" element={<CookieSettingsPage />} />
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
              <ProfessionalLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="agenda" element={<ProfessionalAgendaPage />} />
        <Route path="notifications" element={<ProfessionalNotificationsPage />} />
        <Route path="offers/:id/details" element={<OfferDetailsPage />} />
        <Route path="reminders/:id/details" element={<ReminderDetailsPage />} />
        <Route path="cancellations/:id/details" element={<CancellationDetailsPage />} />
        <Route path="payments/:id/details" element={<PaymentConfirmedDetailsPage />} />
        <Route path="reviews/:id/details" element={<ReviewDetailsPage />} />
        <Route path="marketplace" element={<ProfessionalMarketplacePage />} />
        <Route path="profile" element={<ProfessionalProfilePage />} />
        <Route path="profile/edit-profile" element={<EditProfessionalProfilePage />} />
        <Route path="profile/profile-settings" element={<ProfileSettingsPage />} />
        <Route path="profile/profile-privacy" element={<ProfilePrivacyPage />} />
        <Route path="profile/payment-methods" element={<PaymentMethodsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<ProfessionalHelpPage />} />
        <Route path="home" element={<ProfessionalHomePage />} />
        <Route path="*" element={<Navigate to="/professional/agenda" replace />} />
      </Route>

      {/* ── Administrador ──────────────────────────────────────── */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={[ROLES.ADMINISTRADOR]}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<AdminHomePage />} />
        <Route path="moderation" element={<AdminModerationPage />} />
        {/* Agregar más rutas de admin aquí */}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Route>

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
