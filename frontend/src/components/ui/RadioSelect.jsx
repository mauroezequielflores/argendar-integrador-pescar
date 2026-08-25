import React, { useState, useRef, useEffect, forwardRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

/**
 * RadioSelect — Dropdown personalizado con opciones tipo radio button.
 * Integrado con React Hook Form vía forwardRef (usa Controller preferiblemente).
 */
const RadioSelect = forwardRef(function RadioSelect(
  {
    label,
    id,
    options = [],
    value,
    onChange,
    error,
    placeholder = "Selecciona una opción",
    className = "",
    icon: Icon,
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col gap-1 w-full" ref={containerRef}>
      {label && (
        <label className="text-xs font-medium text-white mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={ref}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between rounded-[6px] border bg-[#292929] py-2.5 px-3
            text-sm transition-colors duration-200 focus:outline-none
            ${error ? "border-red-500" : isOpen ? "border-[#F78736]" : "border-[#3f3f3f] hover:border-[#555]"}
            ${selectedOption ? "text-white" : "text-[#A8A8AA]"}
            ${className}
          `}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
          </div>
          <ChevronDownIcon className={`h-4 w-4 text-[#A8A8AA] transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-[#292929] border border-[#3f3f3f] rounded-[6px] shadow-lg z-50 overflow-hidden flex flex-col">
            {options.map((opt, idx) => {
              const isSelected = value === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`group flex items-center justify-between p-3 cursor-pointer transition-all border
                    ${isSelected ? "border-[#F78736] z-10" : "border-transparent border-b-[#3f3f3f] hover:border-[#F78736] hover:z-10"}
                    ${idx === options.length - 1 && !isSelected ? "border-b-transparent" : ""}
                  `}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium transition-colors ${isSelected ? "text-white" : "text-[#eaeaea] group-hover:text-[#F78736]"}`}>
                      {opt.label}
                    </span>
                    {opt.description && (
                      <span className="text-xs text-[#A8A8AA] mt-0.5">{opt.description}</span>
                    )}
                  </div>
                  {/* Radio ring */}
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-colors
                    ${isSelected ? "border-[#F78736]" : "border-[#555] group-hover:border-[#F78736]"}
                  `}>
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-[#F78736]" />
                    )}
                  </div>
                  <input
                    type="radio"
                    className="hidden"
                    name={id}
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                  />
                </label>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default RadioSelect;
