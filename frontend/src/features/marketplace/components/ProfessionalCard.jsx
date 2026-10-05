import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  UserIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { getSupabasePublicUrl } from "../../../utils/formatters";

/**
 * ProfessionalCard — Tarjeta de presentación de un profesional en Marketplace.
 */
export default function ProfessionalCard({ professional, onContact, onViewProfile }) {
  const navigate = useNavigate();
  if (!professional) return null;

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(professional);
    } else {
      // Redirige al perfil público del profesional usando su ID
      navigate(`/client/professional/${professional.id}`);
    }
  };

  // Mapeo seguro para tolerar los datos del mock y los datos de la base de datos real
  const calificacion = professional.calificacion || professional.rating;
  const resenasCount = professional.resenasCount || professional.reviews;
  const avatarUrl = professional.avatar_url || professional.avatar || professional.imagen;

  return (
    <Card rounded="sm" className="flex flex-col gap-0 border border-[#323232] bg-[#222222] pl-4 pt-2.5 pr-4 pb-2 hover:border-[#404040] transition-colors">
      
      {/* ── Encabezado (Insignias de Profesional y Categoría) ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#888888] tracking-wide mr-1">
            PROFESIONAL <span className="mx-0.5 text-[#555]">•</span>
          </span>
          {professional.categoria && (
            <span className="inline-flex items-center rounded-[4px] border border-[#3a3a3a] bg-transparent px-2 py-0.5 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wider">
              {professional.categoria}
            </span>
          )}
          {professional.ubicacion && (
            <span className="inline-flex items-center gap-1 rounded-[4px] border border-[#3a3a3a] bg-transparent px-2 py-0.5 text-[10px] font-bold text-[#A8A8AA] uppercase tracking-wider">
              <MapPinIcon className="h-3 w-3" />
              {professional.ubicacion}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-[11px] text-[#888888]">
          {calificacion && (
            <div className="flex items-center gap-1 text-[#FFFFFF]">
              <StarIconSolid className="h-3.5 w-3.5 text-[#F78736]" />
              <span className="font-semibold">{calificacion}</span>
              {resenasCount && (
                <span className="text-[#A8A8AA]">({resenasCount})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Medio: Foto de Perfil, Nombre y Descripción ──────── */}
      <div className="flex items-center gap-3 pb-3">
        <div className="h-14 w-14 shrink-0 rounded-full bg-[#323232] flex items-center justify-center overflow-hidden border border-[#404040]">
          {avatarUrl ? (
            <img 
              src={avatarUrl.startsWith('http') ? avatarUrl : getSupabasePublicUrl(avatarUrl, 'avatars')} 
              alt="avatar" 
              className="h-full w-full object-cover" 
            />
          ) : professional.nombre ? (
            <span className="text-lg font-bold uppercase tracking-wider text-white">
              {professional.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
          ) : (
            <UserIcon className="h-7 w-7 text-[#A8A8AA]" />
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="text-sm font-bold text-white leading-tight">{professional.nombre}</h3>
          <span className="text-[13px] text-[#A8A8AA] font-medium line-clamp-2">
            {professional.descripcion}
          </span>
        </div>
      </div>

      {/* ── Pie de tarjeta: Botón Ver Perfil ──────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#323232]">
        <div className="flex items-center gap-2 text-[#888888] text-[13px]">
          {professional.precioBase && (
            <>
              <span>Precio Base:</span>
              <span className="text-[#E0E0E0] font-medium ml-1">${professional.precioBase}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button 
            variant="ghost" 
            onClick={handleViewProfile} 
            className="border border-[#3a3a3a] text-[13px] font-medium text-white hover:bg-[#3a3a3a] px-4 py-1.5 rounded-[6px] transition-colors h-auto"
          >
            Ver perfil <ArrowRightIcon className="h-3.5 w-3.5 inline-block ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
