import { forwardRef, useState } from "react";

/**
 * Textarea — Campo de texto multilínea reutilizable.
 *
 * Integrado con React Hook Form vía forwardRef.
 * Opcionalmente muestra un contador de caracteres si se provee maxLength.
 */
const Textarea = forwardRef(function Textarea(
  {
    label,
    id,
    placeholder,
    error,
    className = "",
    maxLength,
    ...props
  },
  ref
) {
  const [charCount, setCharCount] = useState(props.defaultValue?.length || 0);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-white">
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          ref={ref}
          id={id}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={handleChange}
          className={`
            w-full rounded-[6px] border bg-transparent px-3 py-2.5 text-xs
            text-sm text-white placeholder-[#A8A8AA]
            transition-colors duration-200 resize-y min-h-[120px]
            focus:outline-none focus:ring-2 focus:ring-[#F78736] focus:ring-offset-0
            ${error
              ? "border-red-500 focus:ring-red-500"
              : "border-[#3a3a3a] hover:border-[#555] focus:border-[#F78736]"
            }
            ${className}
          `}
          {...props}
        />
        
        {maxLength && (
          <div className="absolute bottom-3 right-3 text-xs text-[#A8A8AA]">
            {charCount} / {maxLength}
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default Textarea;
