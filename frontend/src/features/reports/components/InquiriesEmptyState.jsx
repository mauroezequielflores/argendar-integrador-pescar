import React from "react";
import { InboxIcon } from "@heroicons/react/24/outline";

/**
 * InquiriesEmptyState — Estado vacío contextual para la bandeja de consultas.
 *
 * @param {string} title - Título del estado vacío.
 * @param {string} description - Descripción del estado vacío.
 */
export default function InquiriesEmptyState({
  title = "No hay consultas registradas",
  description = "Cuando los usuarios envíen consultas desde la sección de ayuda, aparecerán aquí.",
}) {
  return (
    <div
      className="flex min-h-[350px] w-full flex-col items-center justify-center rounded-[6px] bg-[#292929] px-6 py-16 text-center border border-[#323232]"
      role="status"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#323232] text-[#A8A8AA]">
        <InboxIcon className="h-7 w-7 text-[#A8A8AA]" />
      </div>

      <h3 className="text-lg font-bold text-white">{title}</h3>

      {description && (
        <p className="mt-1.5 max-w-md text-sm text-[#A8A8AA]">
          {description}
        </p>
      )}
    </div>
  );
}
