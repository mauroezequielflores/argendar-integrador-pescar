import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function HelpHero({
  userName = "Nombre",
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-2 pb-4">
      {/* Título de bienvenida */}
      <h1 className="text-2xl font-bold leading-tight text-white">
        Hola, {userName} ¿Con qué te ayudamos?
      </h1>
      <p className="mt-1 text-xs sm:text-sm text-[#A8A8AA]">
        Encontrá guías, tutoriales y contactá con nuestro equipo de soporte.
      </p>

      {/* Buscador de Ayuda */}
      <div className="relative mt-6 w-full max-w-2xl">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A8AA]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cómo puedo cancelar una oferta..."
          className="w-full rounded-[20px] border border-[#323232] bg-[#292929] py-2.5 pl-10 pr-4 text-xs sm:text-xs text-white placeholder-[#A8A8AA] transition-colors focus:border-[#F78736] focus:outline-none"
        />
      </div>
    </div>
  );
}
