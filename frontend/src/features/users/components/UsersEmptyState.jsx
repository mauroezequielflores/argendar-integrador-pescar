import React from "react";

/**
 * UsersEmptyState — Estado vacío específico para usuarios según las capturas de diseño.
 *
 * @param {string} title - Título del estado vacío.
 * @param {string} description - Descripción o mensaje secundario.
 * @param {string} [className=""] - Clases adicionales.
 */
export default function UsersEmptyState({
  title = "No hay usuarios registrados",
  description = "No encontramos usuarios para mostrar en este momento.",
  className = "",
}) {
  return (
    <div
      className={`flex min-h-[380px] w-full flex-col items-center justify-center rounded-[6px] bg-[#292929] px-6 py-16 text-center ${className}`}
      role="status"
    >
      {/* ── Icono de usuario desactivado según diseño ── */}
      <div className="mb-4 flex items-center justify-center text-[#A8A8AA]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-[#A8A8AA]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          {/* User head and body with slash */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18"
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* ── Título ── */}
      <h3 className="text-lg font-bold text-white">
        {title}
      </h3>

      {/* ── Descripción ── */}
      {description && (
        <p className="mt-1.5 max-w-md text-sm text-[#A8A8AA]">
          {description}
        </p>
      )}
    </div>
  );
}
