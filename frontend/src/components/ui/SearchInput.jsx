import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * SearchInput — Campo de búsqueda reutilizable con icono de lupa y botón opcional de limpiar.
 *
 * @param {string} value - Valor actual del input.
 * @param {function} onChange - Callback al cambiar el texto.
 * @param {string} [placeholder="Buscar..."] - Texto del placeholder.
 * @param {function} [onClear] - Callback al limpiar el campo.
 * @param {string} [className=""] - Clases adicionales para el contenedor.
 * @param {string} [inputClassName=""] - Clases adicionales para el input.
 * @param {string} [id] - ID opcional para accesibilidad.
 */
export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Buscar...",
  onClear,
  className = "",
  inputClassName = "",
  id,
  ...props
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: "" } });
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#A8A8AA]">
        <MagnifyingGlassIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
      </div>

      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-[6px] border border-[#3a3a3a] bg-transparent py-2.5 pl-10 pr-10 text-sm text-white placeholder-[#A8A8AA] transition-colors hover:border-[#555] focus:border-[#F78736] focus:outline-none focus:ring-2 focus:ring-[#F78736] ${inputClassName}`}
        {...props}
      />

      {value && value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          title="Limpiar búsqueda"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#A8A8AA] hover:text-white transition-colors cursor-pointer"
        >
          <XMarkIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
