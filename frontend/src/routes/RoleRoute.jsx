import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";

/**
 * RoleRoute — Verifica que el usuario tenga uno de los roles permitidos.
 *
 * Uso:
 *   <RoleRoute allowedRoles={[ROLES.ADMINISTRADOR]}>
 *     <AdminDashboardPage />
 *   </RoleRoute>
 *
 * Si el rol no coincide, muestra un mensaje de "Acceso no autorizado"
 * o redirige según la configuración.
 */
export default function RoleRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const hasPermission = allowedRoles.includes(user?.role);

  if (!hasPermission) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#292929] px-6 text-center">
        <div className="rounded-[20px] bg-[#202020] p-10">
          <p className="text-2xl font-semibold text-white">🚫 Acceso no autorizado</p>
          <p className="mt-2 text-sm text-[#A8A8AA]">
            No tenés permiso para acceder a esta sección.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 rounded-[6px] bg-[#FD7B03] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#e06d00] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return children;
}
