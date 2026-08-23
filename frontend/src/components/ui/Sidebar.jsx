import { ArrowLeftOnRectangleIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import SidebarItem from "./SidebarItem";

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  sections,
  onLogout,
  onMobileClose,
}) {
  return (
    <aside
      className={`flex h-full flex-col border-r border-[#292929] bg-[#202020] transition-all duration-300 relative ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Desktop Expand/Collapse Button floating on the right border */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute right-0 translate-x-1/2 top-3 z-50 p-1 rounded-full bg-[#202020] border border-[#292929] text-[#A8A8AA] hover:bg-[#292929] hover:text-white transition-colors"
        title={isCollapsed ? "Expandir" : "Colapsar"}
      >
        <Bars3BottomLeftIcon className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
      </button>

      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4 scrollbar-thin">
        <nav className="flex-1 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx}>
              {/* Separator for other sections when collapsed */}
              {isCollapsed && idx > 0 && section.title && (
                <div className="mb-2 h-px w-full bg-[#292929]" />
              )}

              {/* Title when expanded */}
              {!isCollapsed && section.title && (
                <div className="mb-2 px-3">
                  <p className="text-xs font-semibold text-[#A8A8AA] uppercase tracking-wider truncate">
                    {section.title}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <SidebarItem
                    key={itemIdx}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    onClick={onMobileClose}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {onLogout && (
          <div className="mt-8 border-t border-[#292929] pt-4">
            <button
              onClick={onLogout}
              title={isCollapsed ? "Cerrar sesión" : undefined}
              className="flex w-full items-center gap-3 rounded-[6px] px-3 py-2 text-sm font-medium text-[#A8A8AA] transition-colors hover:bg-[#323232] hover:text-[#FFFFFF]"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Cerrar sesión</span>}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
