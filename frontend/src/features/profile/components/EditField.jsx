import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Input from "../../../components/ui/Input";

/**
 * EditField — Campo de formulario bloqueado con botón de edición.
 *
 * @param {string} label - Etiqueta superior.
 * @param {string} value - Valor actual del input.
 * @param {string} prefix - Texto prefijo opcional (ej. "DNI").
 * @param {boolean} required - Si es verdadero muestra asterisco rojo.
 * @param {boolean} verified - Si es verdadero muestra tilde verde en la etiqueta.
 * @param {string} type - Tipo de input ("text", "password", etc).
 */
export default function EditField({
  label,
  value,
  prefix,
  required = false,
  verified = false,
  type = "text",
}) {
  const [disabled, setDisabled] = useState(true);
  const [currentValue, setCurrentValue] = useState(value);

  const handleEditClick = () => {
    setDisabled(!disabled);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white">{label}</span>
        {required && <span className="text-red-500 font-bold">*</span>}
        {verified && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input 
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            disabled={disabled}
            prefix={prefix}
            type={type}
          />
        </div>
        <button 
          onClick={handleEditClick}
          className="flex-shrink-0 flex items-center justify-center h-[38px] w-[38px] rounded-md border border-[#3a3a3a] bg-[#2e2e2e] hover:bg-[#3a3a3a] transition-colors"
          aria-label={`Editar ${label}`}
        >
          <PencilSquareIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}
