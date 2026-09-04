import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { mockProfessionalHome } from "../data/mockHome";

export default function ProfessionalHomePage() {
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
          Bienvenido, <span className="text-[#FD7B03]">{user?.name}</span>
        </h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">Resumen de tu actividad</p>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#2a2a2a] p-4 text-center">
            <p className="text-xs text-[#A8A8AA]">Ganancias del mes</p>
            <p className="mt-1 text-xl font-bold text-[#4CAF50]">${mockProfessionalHome.stats.monthlyEarnings}</p>
          </div>
          <div className="rounded-xl bg-[#2a2a2a] p-4 text-center">
            <p className="text-xs text-[#A8A8AA]">Ofertas Pendientes</p>
            <p className="mt-1 text-xl font-bold text-[#FD7B03]">{mockProfessionalHome.stats.pendingOffers}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-medium text-white">Actividad Reciente</h2>
          <div className="mt-3 space-y-2">
            {mockProfessionalHome.recentActivity.map((act) => (
              <div key={act.id} className="flex justify-between rounded-lg bg-[#2a2a2a] p-3 text-sm">
                <span className="text-[#A8A8AA]">{act.text}</span>
                <span className="text-xs text-[#555]">{act.time}</span>
              </div>
            ))}
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
