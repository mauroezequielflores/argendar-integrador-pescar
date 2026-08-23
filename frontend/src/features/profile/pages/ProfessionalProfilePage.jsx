import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  GlobeAltIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ChevronRightIcon,
  StarIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import { ROUTES } from "../../../constants/routes";
import { mockProfessionalProfile } from "../data/mockProfessionalProfile";

// ─── Header ──────────────────────────────────────────────────────────────────

function ProfessionalProfileHeader({ profile }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-[6px] border border-[#323232] bg-[#292929]">
      {/* Banner */}
      <div className="h-24 rounded-t-[6px] bg-[#323232]" />

      {/* Info row */}
      <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-4 -mt-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-full bg-[#E5E7EB]" />
            {profile.isOnline && (
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#292929] bg-green-500" />
            )}
          </div>
          {/* Nombre + título */}
          <div className="pb-1">
            <h1 className="text-xl font-bold text-white">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-sm text-[#A8A8AA]">{profile.titulo}</p>
          </div>
        </div>

        {/* Botón editar */}
        <button
          onClick={() => navigate("/professional/profile/edit-profile")}
          className="flex items-center gap-2 self-start rounded-[6px] border border-[#323232] bg-transparent px-4 py-2 text-xs font-medium text-white hover:bg-[#323232] transition-colors sm:self-auto"
        >
          <PencilSquareIcon className="h-4 w-4" />
          Editar perfil público
        </button>
      </div>
    </div>
  );
}

// ─── Tab Nav ─────────────────────────────────────────────────────────────────

function TabNav({ active, onChange }) {
  const tabs = [
    { id: "public", label: "Perfil público", icon: GlobeAltIcon },
    { id: "info", label: "Información de perfil", icon: ClipboardDocumentListIcon },
  ];

  return (
    <div className="flex gap-6 border-b border-[#323232]">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
            active === id
              ? "border-b-2 border-[#F78736] text-white"
              : "text-[#A8A8AA] hover:text-white"
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Panel: Perfil público ────────────────────────────────────────────────────

function SobreMiCard({ descripcion, habilidades }) {
  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
      <h2 className="text-base font-semibold text-white">Sobre mi</h2>
      <div className="min-h-[80px] rounded-[6px] bg-[#323232] p-4 text-sm text-[#A8A8AA]">
        {descripcion}
      </div>
      <button className="self-start text-sm font-medium text-[#F78736] hover:underline">
        Leer biografía completa
      </button>
      {/* CA04: habilidades solo si hay al menos una */}
      {habilidades.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {habilidades.map((h) => (
            <span
              key={h}
              className="rounded-full bg-[#323232] px-3 py-1 text-xs text-[#A8A8AA]"
            >
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoProfesionalCard({ profile }) {
  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
      <h2 className="text-base font-semibold text-white">Información Profesional</h2>
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#A8A8AA]">Ubicación base</span>
          <span className="text-white">{profile.ubicacionBase}</span>
        </div>
        <div className="h-px bg-[#323232]" />
        <div className="flex items-center justify-between">
          <span className="text-[#A8A8AA]">Radio de cobertura</span>
          <span className="text-white">{profile.radioCobertura}</span>
        </div>
        <div className="h-px bg-[#323232]" />
        <div className="flex items-center justify-between">
          <span className="text-[#A8A8AA]">Miembro desde</span>
          <span className="font-medium text-white">{profile.memberSince}</span>
        </div>
      </div>
      {profile.certificaciones.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#A8A8AA]">
            Certificaciones
          </p>
          {profile.certificaciones.map((cert) => (
            <div key={cert.nombre} className="flex items-center gap-2">
              <AcademicCapIcon className="h-4 w-4 text-[#A8A8AA]" />
              <span className="text-sm text-white">{cert.nombre}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DisponibilidadCard({ disponibilidad }) {
  return (
    <div className="flex flex-col gap-3 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
      <h2 className="text-base font-semibold text-white">Disponibilidad</h2>
      {disponibilidad.horarios.length === 0 ? (
        <div className="rounded-[6px] bg-[#323232] p-4 text-sm text-[#A8A8AA]">
          Sin horarios disponibles.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {disponibilidad.horarios.map((h, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-[#A8A8AA]">{h.dia}</span>
              <span className="text-white">{h.rango}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CalificacionesCard({ rating, reviewsCount }) {
  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
      <h2 className="text-base font-semibold text-white">Resumen de Calificaciones</h2>
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl font-bold text-white">{rating.toFixed(1)}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIconSolid key={s} className="h-5 w-5 text-[#323232]" />
          ))}
        </div>
        <p className="text-xs text-[#A8A8AA]">Basado en {reviewsCount} reseñas</p>
      </div>
      <div className="flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-3 text-xs text-[#A8A8AA]">
            <span className="w-2">{star}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#323232]">
              <div className="h-full rounded-full bg-[#F78736]" style={{ width: "0%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpinionesCard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
      <h2 className="text-base font-semibold text-white">Opiniones recientes</h2>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#323232]">
          <StarIcon className="h-6 w-6 text-[#A8A8AA]" />
        </div>
        <p className="text-base font-semibold text-white">Aún no hay reseñas</p>
        <p className="max-w-xs text-sm text-[#A8A8AA]">
          Las opiniones de los clientes aparecerán aquí cuando comiencen a calificar el servicio.
        </p>
        <button
          onClick={() => navigate(ROUTES.PROFESSIONAL_MARKETPLACE)}
          className="mt-2 rounded-[6px] bg-[#F78736] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#e06d00] transition-colors"
        >
          Enviar ofertas
        </button>
      </div>
    </div>
  );
}

function PublicProfileTab({ profile }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Fila 1: Sobre mí (izq) + Info profesional + Disponibilidad (der) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <SobreMiCard
          descripcion={profile.descripcion}
          habilidades={profile.habilidades}
        />
        <div className="flex flex-col gap-4">
          <InfoProfesionalCard profile={profile} />
          {/* CA06: solo renderizar si disponibilidad no es null */}
          {profile.disponibilidad !== null && (
            <DisponibilidadCard disponibilidad={profile.disponibilidad} />
          )}
        </div>
      </div>

      {/* Fila 2: Calificaciones (izq) + Opiniones (der) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <CalificacionesCard
          rating={profile.rating}
          reviewsCount={profile.reviewsCount}
        />
        <OpinionesCard />
      </div>
    </div>
  );
}

// ─── Panel: Información de perfil ────────────────────────────────────────────

const INFO_CARDS = [
  {
    id: "config",
    label: "Configurar Perfil",
    description: "Datos personales de tu cuenta profesional.",
    icon: UserCircleIcon,
    to: "/professional/profile/profile-settings",
  },
  {
    id: "privacidad",
    label: "Privacidad",
    description: "Preferencias y control sobre el uso de tus datos.",
    icon: ShieldCheckIcon,
    to: "/professional/profile/profile-privacy",
  },
  {
    id: "pagos",
    label: "Métodos de pago",
    description: "Administrá tus métodos de pago guardados en la plataforma.",
    icon: CreditCardIcon,
    to: "/professional/profile/payment-methods",
  },
];

function InfoProfileTab({ completitud }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* 3 nav cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {INFO_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => navigate(card.to)}
              className="group flex items-center gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5 text-left hover:border-[#F78736] transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#323232]">
                <Icon className="h-5 w-5 text-[#A8A8AA]" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-semibold text-white">{card.label}</p>
                <p className="text-xs text-[#A8A8AA]">{card.description}</p>
              </div>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-[#A8A8AA] group-hover:text-white transition-colors" />
            </button>
          );
        })}
      </div>

      {/* Tarjeta de completitud */}
      <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#323232]">
          <RocketLaunchIcon className="h-5 w-5 text-[#A8A8AA]" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-sm text-white">
            ¿Querés comenzar a enviar ofertas a posibles clientes de tu zona? Completá tu perfil
            profesional
          </p>
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#323232]">
              <div
                className="h-full rounded-full bg-[#F78736] transition-all"
                style={{ width: `${completitud}%` }}
              />
            </div>
            <span className="shrink-0 text-xs text-[#A8A8AA]">{completitud}% completado</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/professional/profile/profile-settings")}
          className="shrink-0 rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors"
        >
          Completar perfil
        </button>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProfessionalProfilePage() {
  const [activeTab, setActiveTab] = useState("public");
  const profile = mockProfessionalProfile;

  return (
    <div className="flex flex-col gap-6">
      <ProfessionalProfileHeader profile={profile} />
      <TabNav active={activeTab} onChange={setActiveTab} />
      {activeTab === "public" ? (
        <PublicProfileTab profile={profile} />
      ) : (
        <InfoProfileTab completitud={profile.completitudPerfil} />
      )}
    </div>
  );
}
