import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

/**
 * Select — Dropdown personalizado.
 */
export default function Select({ options = [], value, onChange, className = "", id }) {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-[6px] border border-[#3f3f3f] bg-[#292929] py-1.5 pl-3 pr-8 text-sm text-white transition-colors focus:border-[#FD7B03] focus:outline-none focus:ring-1 focus:ring-[#FD7B03] cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-[#A8A8AA]">
        <ChevronDownIcon className="h-4 w-4" />
      </div>
    </div>
  );
}
