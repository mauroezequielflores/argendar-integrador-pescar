import { CheckCircleIcon } from "@heroicons/react/24/solid";

/**
 * InfoRow — Fila estandarizada de información.
 *
 * Muestra un ícono contenedor a la izquierda, título y subtítulo en el centro,
 * y opcionalmente un check verde a la derecha indicando validación.
 */
export default function InfoRow({ 
  icon: Icon, 
  title, 
  subtitle, 
  verified = false,
  className = ""
}) {
  return (
    <div className={`flex items-center justify-between py-4 border-b border-[#3a3a3a] last:border-b-0 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Contenedor del ícono */}
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#3a3a3a] flex-shrink-0">
            <Icon className="h-5 w-5 text-[#A8A8AA]" />
          </div>
        )}
        
        {/* Textos */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{title}</span>
          <span className="text-xs text-[#A8A8AA] mt-0.5">{subtitle}</span>
        </div>
      </div>
      
      {/* Icono de validación */}
      {verified && (
        <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 ml-4" />
      )}
    </div>
  );
}
