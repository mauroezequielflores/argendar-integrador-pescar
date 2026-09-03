import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { mockAdminHome } from "../data/mockHome";

export default function AdminHomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#292929] p-6 pt-12">
      <div className="w-full max-w-md rounded-[20px] bg-[#202020] p-8 text-left shadow-2xl">
        <h1 className="text-2xl font-semibold text-white">
          Panel de <span className="text-[#FD7B03]">Administrador</span>
        </h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">Métricas de la plataforma</p>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#2a2a2a] p-4 text-center border-l-4 border-blue-500">
            <p className="text-xs text-[#A8A8AA]">Usuarios Activos</p>
            <p className="mt-1 text-xl font-bold text-white">{mockAdminHome.systemMetrics.activeUsers}</p>
          </div>
          <div className="rounded-xl bg-[#2a2a2a] p-4 text-center border-l-4 border-green-500">
            <p className="text-xs text-[#A8A8AA]">Nuevos Profesionales</p>
            <p className="mt-1 text-xl font-bold text-white">{mockAdminHome.systemMetrics.newProfessionals}</p>
          </div>
          <div className="rounded-xl bg-[#2a2a2a] p-4 text-center border-l-4 border-red-500">
            <p className="text-xs text-[#A8A8AA]">Disputas Abiertas</p>
            <p className="mt-1 text-xl font-bold text-white">{mockAdminHome.systemMetrics.openDisputes}</p>
          </div>
          <div className="rounded-xl bg-[#2a2a2a] p-4 text-center border-l-4 border-yellow-500">
            <p className="text-xs text-[#A8A8AA]">Ingresos ($)</p>
            <p className="mt-1 text-xl font-bold text-white">{mockAdminHome.systemMetrics.platformRevenue}</p>
          </div>
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
