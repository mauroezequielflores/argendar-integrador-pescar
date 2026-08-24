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
    <div className={`flex items-center gap-6 border-b border-[#3f3f3f] ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 pb-3 pt-1 text-sm font-medium transition-colors ${
              isActive
                ? "border-b-2 border-[#FD7B03] text-white"
                : "border-b-2 border-transparent text-[#A8A8AA] hover:text-white hover:border-[#3f3f3f]"
            }`}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
