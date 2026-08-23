import { ChevronRightIcon } from "@heroicons/react/24/outline";

/**
 * NavRow — Componente reutilizable para filas de navegación en configuraciones.
 *
 * @param {React.Component} icon - Ícono Heroicon a mostrar a la izquierda.
 * @param {string} title - Título principal de la fila.
 * @param {string} subtitle - Texto descriptivo secundario.
 * @param {function} onClick - Función al hacer click en toda la fila.
 */
export default function NavRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-5 border-b border-[#3a3a3a] last:border-b-0 hover:bg-[#3a3a3a] transition-colors text-left ${className}`}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#3a3a3a] flex-shrink-0">
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white mb-0.5">{title}</span>
          <span className="text-xs text-[#A8A8AA]">{subtitle}</span>
        </div>
      </div>
      <ChevronRightIcon className="h-5 w-5 text-[#A8A8AA] flex-shrink-0 ml-4" />
    </button>
  );
}
