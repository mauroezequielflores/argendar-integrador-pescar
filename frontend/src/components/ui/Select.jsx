import { forwardRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

/**
 * Select — Dropdown personalizado.
 *
 * Integrado con React Hook Form vía forwardRef.
 */
const Select = forwardRef(function Select(
  {
    label,
    id,
    options = [],
    error,
    className = "",
    classNameLabel = "",
    classNameSelect = "",
    ...props
  },
  ref
) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={id}
          className={classNameLabel || "text-xs font-medium text-white"}
        >
          {label}
        </label>
      )}

      <div className={`relative ${className}`}>
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${classNameSelect}
           rounded-[6px] w-full border border-[#323232] bg-[#202020] text-white transition-colors hover:border-[#555] focus:border-[#F78736] focus:outline-none cursor-pointer 
            ${error
              ? "border-red-500 focus:ring-red-500"
              : "border-[#3f3f3f] hover:border-[#555] focus:border-[#F78736]"
            }
          `}
          {...props}
        >
          <option value="" disabled hidden>
            Selecciona una opción
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;
