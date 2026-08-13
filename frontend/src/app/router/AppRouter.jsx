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
              <Routes>
                <Route path="home" element={<ClientHomePage />} />
                {/* Agregar más rutas de cliente aquí */}
                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

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
