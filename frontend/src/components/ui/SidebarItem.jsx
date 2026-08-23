import { NavLink } from "react-router-dom";

export default function SidebarItem({ to, icon: Icon, label, onClick, isCollapsed }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-[6px] px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-[#292929] text-[#FFFFFF]"
            : "text-[#A8A8AA] hover:bg-[#323232] hover:text-[#FFFFFF]"
        }`
      }
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
