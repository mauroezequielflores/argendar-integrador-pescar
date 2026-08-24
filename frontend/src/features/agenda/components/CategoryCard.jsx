import React from "react";

/**
 * CategoryCard — Tarjeta de selección de categoría para creación de solicitudes.
 */
export default function CategoryCard({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        flex min-w-[200px] flex-1 flex-col items-center justify-center gap-3 rounded-[8px] border p-6 cursor-pointer transition-colors text-center
        ${
          isSelected
            ? "border-[#F78736] bg-[#292929]"
            : "border-[#3f3f3f] bg-[#202020] hover:border-[#555]"
        }
      `}
    >
      {Icon && (
        <Icon className={`h-10 w-10 ${isSelected ? "text-[#F78736]" : "text-white"}`} strokeWidth={1.5} />
      )}
      <div className="mt-2">
        <h3 className={`text-sm font-bold ${isSelected ? "text-[#F78736]" : "text-white"}`}>{title}</h3>
        <p className="text-[11px] text-[#A8A8AA] mt-1 line-clamp-2 leading-tight px-2">{description}</p>
      </div>
    </div>
  );
}
