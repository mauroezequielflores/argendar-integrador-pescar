import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { mockClientHome } from "../data/mockHome";

export default function ClientHomePage() {
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
          Hola, <span className="text-[#FD7B03]">{user?.name}</span> 👋
        </h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">¿Qué servicio necesitas hoy?</p>
        
        <div className="mt-6">
          <h2 className="text-sm font-medium text-white">Categorías Recomendadas</h2>
          <div className="mt-3 flex gap-3 overflow-x-auto">
            {mockClientHome.recommendedCategories.map((cat) => (
              <div key={cat.id} className="flex flex-col items-center justify-center rounded-xl bg-[#2a2a2a] p-3 text-center min-w-[80px]">
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs text-[#A8A8AA]">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-medium text-white">Búsquedas Recientes</h2>
          <div className="mt-3 space-y-2">
            {mockClientHome.recentSearches.map((search) => (
              <div key={search.id} className="flex justify-between rounded-lg bg-[#2a2a2a] p-3 text-sm">
                <span className="text-[#A8A8AA]">{search.term}</span>
                <span className="text-xs text-[#555]">{search.date}</span>
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
