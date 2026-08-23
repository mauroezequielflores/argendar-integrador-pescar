import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ROUTES } from "../../../constants/routes";

/**
 * AdminHomePage — Pantalla principal del Administrador (demo).
 * Ruta: /admin/home
 *
 * Esta pantalla será reemplazada por el dashboard completo en sprints futuros.
 */
export default function AdminHomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#292929] p-6">
      <div className="w-full max-w-md rounded-[20px] bg-[#202020] p-10 text-center shadow-2xl">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FD7B03]/10">
          <span className="text-2xl">⚙️</span>
        </div>
        <h1 className="text-2xl font-semibold text-white">
          Esta es la pantalla principal del Administrador.
        </h1>
        <p className="mt-2 text-sm text-[#A8A8AA]">
          Hola, <span className="text-white font-medium">{user?.name}</span>. Aquí
          se desarrollará el dashboard de administración en el próximo sprint.
        </p>
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-[#FD7B03]/10 px-3 py-1 text-xs font-medium text-[#FD7B03]">
            Rol: Administrador
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded-[6px] border border-[#3a3a3a] bg-transparent px-4 py-2.5 text-sm text-[#A8A8AA] transition-colors hover:border-red-500/50 hover:text-red-400"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
