import { forwardRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

/**
 * Input — Campo de formulario reutilizable.
 *
 * Integrado con React Hook Form vía forwardRef.
 * Soporta type="password" con toggle de visibilidad.
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    type = "text",
    placeholder,
    error,
    className = "",
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-white"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={inputType}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
            w-full rounded-[6px] border bg-transparent px-3 py-2.5 text-xs
            text-sm text-white placeholder-[#A8A8AA]
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[#FD7B03] focus:ring-offset-0
            ${error
              ? "border-red-500 focus:ring-red-500"
              : "border-[#3a3a3a] hover:border-[#555] focus:border-[#FD7B03]"
            }
            ${isPassword ? "pr-10" : ""}
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A8AA] hover:text-white transition-colors"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
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

export default Input;
