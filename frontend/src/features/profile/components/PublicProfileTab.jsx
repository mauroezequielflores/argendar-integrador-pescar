import { EnvelopeIcon, MapPinIcon, CalendarIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function PublicProfileTab({ profile }) {
  const navigate = useNavigate();

  return (
    <div className="mt-8 space-y-6">
      {/* ── Primera Fila: Sobre mi & Detalles ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Sobre mi */}
        <div className="bg-[#292929] rounded-[6px] p-6 border border-[#3a3a3a]">
          <h2 className="text-lg font-bold text-[#FFFFFF] mb-4">Sobre mi</h2>
          <div className="bg-[#323232] rounded-[6px] p-4 text-sm text-[#A8A8AA] min-h-[80px]">
            {profile.description}
          </div>
          <button className="mt-4 text-[#F78736] text-sm font-semibold hover:underline">
            Leer biografía completa
          </button>
        </div>

        {/* Card: Detalles */}
        <div className="bg-[#292929] rounded-[6px] p-6 border border-[#3a3a3a]">
          <h2 className="text-lg font-bold text-[#FFFFFF] mb-4">Detalles</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-[#A8A8AA]">
                <EnvelopeIcon className="h-5 w-5" />
                <span>Correo electrónico</span>
              </div>
              <span className="text-[#FFFFFF]">{profile.email}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-[#A8A8AA]">
                <MapPinIcon className="h-5 w-5" />
                <span>Ubicación</span>
              </div>
              <span className="text-[#FFFFFF]">{profile.location}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-[#A8A8AA]">
                <CalendarIcon className="h-5 w-5" />
                <span>Miembro desde</span>
              </div>
              <span className="text-[#FFFFFF]">{profile.memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Segunda Fila: Resumen de Calificaciones & Opiniones recientes ── */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* Card: Resumen de Calificaciones */}
        <div className="bg-[#292929] rounded-[6px] p-6 border border-[#3a3a3a] flex flex-col items-center">
          <h2 className="text-lg font-bold text-[#FFFFFF] mb-6 self-start">Resumen de Calificaciones</h2>
          
          <div className="text-5xl font-bold text-[#FFFFFF] mb-2">
            {profile.rating.toFixed(1)}
          </div>
          
          <div className="flex gap-1 text-[#323232] mb-2">
            <StarIconSolid className="h-5 w-5" />
            <StarIconSolid className="h-5 w-5" />
            <StarIconSolid className="h-5 w-5" />
            <StarIconSolid className="h-5 w-5" />
            <StarIconSolid className="h-5 w-5" />
          </div>
          
          <p className="text-xs text-[#A8A8AA] mb-8">
            Basado en {profile.reviewsCount} opiniones
          </p>

          <div className="w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3 text-xs text-[#A8A8AA]">
                <span className="w-2">{star}</span>
                <div className="flex-1 h-1.5 bg-[#323232] rounded-full overflow-hidden">
                  <div className="h-full bg-[#F78736]" style={{ width: "0%" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Opiniones recientes */}
        <div className="bg-[#292929] rounded-[6px] border border-[#3a3a3a] p-6 flex flex-col">
          <h2 className="text-lg font-bold text-[#FFFFFF] mb-6">Opiniones recientes</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 bg-[#323232] rounded-full flex items-center justify-center mb-4">
              <StarIcon className="h-6 w-6 text-[#A8A8AA]" />
            </div>
            <h3 className="text-[#FFFFFF] font-bold text-lg mb-2">Aún no enviaste ninguna opinión</h3>
            <p className="text-[#A8A8AA] text-sm max-w-sm mb-6">
              Tus opiniones a profesionales aparecerán aquí cuando comiences a calificar un servicio.
            </p>
            <button
              onClick={() => navigate("/client/marketplace")}
              className="bg-[#F78736] hover:bg-[#e06d00] text-[#FFFFFF] font-medium text-sm px-6 py-2.5 rounded-[6px] transition-colors"
            >
              Solicitar servicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
