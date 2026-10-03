import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ChevronRightIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

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

/**
 * ProfessionalInfoTab — Pestaña de información de perfil y configuraciones.
 */
export default function ProfessionalInfoTab({ completitud = 70 }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full font-sans">
      {/* 3 Navigation Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {INFO_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => navigate(card.to)}
              className="group flex items-center gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5 text-left hover:border-[#F78736] transition-colors cursor-pointer"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#323232]">
                <Icon className="h-5 w-5 text-[#A8A8AA] group-hover:text-white transition-colors" />
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

      {/* Tarjeta de Completitud de Perfil */}
      <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#323232]">
          <RocketLaunchIcon className="h-5 w-5 text-[#A8A8AA]" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-xs sm:text-sm text-white">
            ¿Querés comenzar a enviar ofertas a posibles clientes de tu zona? Completá tu perfil profesional
          </p>
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#323232]">
              <div
                className="h-full rounded-full bg-[#F78736] transition-all duration-500"
                style={{ width: `${completitud}%` }}
              />
            </div>
            <span className="shrink-0 text-xs text-[#A8A8AA]">{completitud}% completado</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/professional/profile/profile-settings")}
          className="shrink-0 rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors cursor-pointer"
        >
          Completar perfil
        </button>
      </div>
    </div>
  );
}
