import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

/**
 * Modal — Contenedor emergente superpuesto.
 *
 * @param {boolean} isOpen - Controla la visibilidad del modal
 * @param {function} onClose - Función que se ejecuta al cerrar
 * @param {string} title - Título del modal
 * @param {node} children - Contenido
 */
export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-[16px] bg-[#202020] border border-[#292929] shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-[#292929] px-6 py-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-[#A8A8AA] hover:bg-[#292929] hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
