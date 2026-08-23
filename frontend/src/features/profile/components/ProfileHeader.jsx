import { useNavigate } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function ProfileHeader({ profile }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3a3a3a]">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E5E7EB] text-xl font-bold text-[#727272]">
            {/* Avatar genérico vacío similar a Figma */}
          </div>
          {profile.isVerified && (
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#202020] bg-green-500"></div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold text-[#FFFFFF]">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-sm text-[#A8A8AA]">
            {profile.isVerified ? "Cliente verificado" : "Cliente no verificado"}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/client/profile/edit-profile")}
        className="flex items-center gap-2 rounded-md border border-[#3a3a3a] px-4 py-2 text-sm font-medium text-[#FFFFFF] hover:bg-[#292929] transition-colors self-start sm:self-center"
      >
        <PencilSquareIcon className="h-4 w-4" />
        Editar perfil público
      </button>
    </div>
  );
}
