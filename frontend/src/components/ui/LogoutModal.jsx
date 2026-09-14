import React, { useEffect } from "react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

/**
 * LogoutModal — Modal de confirmación para cerrar sesión.
 * Reutilizable en cualquier layout o sección autenticada.
 *
 * @param {boolean} isOpen - Estado de visibilidad del modal.
 * @param {function} onClose - Función ejecutada al cancelar o hacer clic fuera del modal.
 * @param {function} onConfirm - Función ejecutada al confirmar el cierre de sesión.
 */
export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  // Manejo de tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Contenedor Modal */}
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-[#292929] border border-[#3a3a3a] p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 transition-all"
        onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro del modal
      >
        {/* Ícono superior circular */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#3f3f3f] bg-[#202020] text-white">
          <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
        </div>

        {/* Textos */}
        <div className="flex flex-col gap-2">
          <h2
            id="logout-title"
            className="text-lg sm:text-xl font-bold text-white leading-snug"
          >
            ¿Estás seguro que quieres cerrar sesión?
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A8AA] leading-relaxed max-w-[320px] mx-auto">
            Perderás el acceso a tu sesión actual y tendrás que volver a ingresar tus credenciales.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-2.5 w-full mt-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-[6px] bg-[#F78736] py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#e5782c] cursor-pointer shadow-sm"
          >
            Cerrar sesión
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[6px] border border-[#3f3f3f] bg-transparent py-2.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#323232] cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
