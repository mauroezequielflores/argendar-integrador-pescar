import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";
import Loader from "../components/ui/Loader";

/**
 * ProtectedRoute — Protege rutas que requieren autenticación.
 *
 * Si el usuario no está autenticado, redirige a /login
 * preservando la ruta de destino original (redirectTo).
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#292929]">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}
