/**
 * ModerationTabs — Pestañas de navegación entre paneles de moderación (CA02).
 *
 * Tab activo: subrayado naranja (#F78736).
 * Tab inactivo: texto secundario (#A8A8AA).
 *
 * @param {Array<{key: string, label: string}>} tabs
 * @param {string}   activeTab
 * @param {function} onTabChange
 */
export default function ModerationTabs({ tabs = [], activeTab, onTabChange }) {
  return (
    <div
      className="flex items-center border-b border-[#292929] gap-0"
      role="tablist"
      aria-label="Paneles de moderación"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.key}`}
            onClick={() => onTabChange(tab.key)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors focus:outline-none ${
              isActive
                ? "text-white"
                : "text-[#A8A8AA] hover:text-white"
            }`}
          >
            {tab.label}
            {/* Subrayado naranja en tab activo */}
            {isActive && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-t bg-[#F78736]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
