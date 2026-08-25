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
    ...props
  },
  ref
) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-white"
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
          className={`
            w-full appearance-none rounded-[6px] border bg-[#292929] py-2.5 pl-3 pr-10
            text-sm text-white transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[#F78736] focus:ring-offset-0 cursor-pointer
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
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#A8A8AA]">
          <ChevronDownIcon className="h-4 w-4" />
        </div>
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
