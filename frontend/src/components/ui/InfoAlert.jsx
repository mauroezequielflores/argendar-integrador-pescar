import { InformationCircleIcon } from "@heroicons/react/24/outline";

/**
 * InfoAlert — Bloque de alerta genérico.
 *
 * Muestra un mensaje informativo con un ícono a la izquierda.
 */
export default function InfoAlert({ children, className = "" }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-[6px] bg-[#2E2E2E] p-4 border border-[#3a3a3a] ${className}`}
      role="alert"
    >
      <InformationCircleIcon className="h-5 w-5 flex-shrink-0 text-[#A8A8AA] mt-0.5" />
      <div className="text-sm text-[#A8A8AA] leading-relaxed w-full">
        {children}
      </div>
    </div>
  );
}
