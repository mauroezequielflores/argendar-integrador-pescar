import React from "react";

/**
 * ModerationTabs — Pestañas de navegación entre paneles de moderación (CA02).
 *
 * Tab activo: texto blanco y subrayado naranja (#F78736).
 * Tab inactivo: texto secundario (#A8A8AA).
 * Disposición: icono + label con gap-2.
 *
 * @param {Array<{key: string, label: string, icon?: React.ComponentType}>} tabs
 * @param {string} activeTab
 * @param {function} onTabChange
 */
export default function ModerationTabs({ tabs = [], activeTab, onTabChange }) {
  return (
    <div
      className="flex items-center gap-6 border-b border-[#323232]"
      role="tablist"
      aria-label="Paneles de moderación"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.key}`}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 pb-3 pt-1 text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? "border-b-2 border-[#F78736] text-white"
                : "border-b-2 border-transparent text-[#A8A8AA] hover:text-white"
            }`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
