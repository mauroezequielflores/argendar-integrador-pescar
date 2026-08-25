import React from "react";

/**
 * Tabs — Componente para navegación por pestañas locales.
 *
 * @param {Array} tabs - Array de objetos { id, label, icon: IconComponent }.
 * @param {string} activeTab - ID de la pestaña activa.
 * @param {function} onChange - Función llamada al hacer clic en una pestaña.
 */
export default function Tabs({ tabs = [], activeTab, onChange, className = "" }) {
  return (
    <div className={`flex items-center gap-6 border-b border-[#323232] ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 pb-3 pt-1 text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? "border-b-2 border-[#F78736] text-white"
                : "border-b-2 border-transparent text-[#A8A8AA] hover:text-white"
            }`}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
