import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  EnvelopeIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import headerDefaultPhoto from "../../../assets/images/header-default-photo.svg";
import Avatar from "../../../components/ui/Avatar";

/**
 * ProfileHeader — Encabezado principal del perfil de cliente (CA01, CA02).
 * Incluye portada, avatar superpuesto con estado, botón de edición,
 * nombre, rol, descripción y fila horizontal de datos clave con íconos.
 */
export default function ProfileHeader({ profile = {} }) {
  const navigate = useNavigate();

  const fullName = profile.firstName && profile.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : profile.name || "Nombre Apellido";

  const description =
    profile.description && profile.description !== "Descripción.pendiente."
      ? profile.description
      : "Hola! Bienvenidos a mi perfil.";

  const email = profile.email || "correoejemplo@gmail.com";
  const memberSince = profile.memberSince || "Enero 2021";
  const location =
    profile.location && profile.location !== "-"
      ? profile.location
      : "Ubicación";

  return (
    <div className="flex flex-col w-full">
      {/* ── 1. Imagen de Portada (Cover) ────────────────────────────── */}
      <div className="relative w-full h-20 sm:h-30 md:h-40 rounded-[12px] overflow-hidden bg-[#292929] border border-[#323232]">
        <img
          src={profile.coverUrl || profile.coverPhoto || headerDefaultPhoto}
          alt="Portada de perfil"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── 2. Avatar Superpuesto con Indicador de Estado ───────────── */}
      <div className="-mt-14 sm:-mt-16 ml-4 sm:ml-6 relative z-10 w-fit">
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-[#202020] bg-[#292929] overflow-hidden shadow-lg flex items-center justify-center">
          <Avatar
            initials={profile.firstName ? profile.firstName[0].toUpperCase() : "U"}
            avatarUrl={profile.avatarUrl || profile.photo}
            isVerified={profile.isVerified}
            size="lg"
          />
        </div>
        {/* Indicador de estado (punto verde) */}
        <span
          className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#202020]"
          title="Estado: Activo"
        />
      </div>

      {/* ── 3. Información del Perfil (CA02) ────────────────────────── */}
      <div className="flex flex-col mt-3">
        {/* Fila: Nombre/Rol + Botón Editar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[#A8A8AA] font-normal mt-0.5">
              {profile.role || "Cliente"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/client/profile/edit-profile")}
            className="flex items-center gap-2 rounded-[6px] border border-[#3f3f3f] bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#292929] cursor-pointer self-start sm:self-auto"
          >
            <PencilSquareIcon className="h-4 w-4 text-white" />
            <span>Editar perfil público</span>
          </button>
        </div>

        {/* Descripción tipo "Sobre mí" */}
        <p className="text-xs sm:text-sm text-white mt-3 font-normal leading-relaxed">
          {description}
        </p>

        {/* Metadatos en una única línea horizontal con íconos */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-3 text-xs text-[#A8A8AA]">
          {/* Correo electrónico */}
          <div className="flex items-center gap-1.5">
            <EnvelopeIcon className="h-4 w-4 text-[#A8A8AA]" />
            <span>
              Correo electronico: <span className="text-white">{email}</span>
            </span>
          </div>

          {/* Miembro desde */}
          <div className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 text-[#A8A8AA]" />
            <span>
              Miembro desde: <span className="text-white">{memberSince}</span>
            </span>
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="h-4 w-4 text-[#A8A8AA]" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
