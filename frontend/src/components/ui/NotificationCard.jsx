import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function NotificationCard({
  title,
  description,
  time,
  icon: Icon,
  iconBgColor = "bg-white",
  iconColor = "text-[#A8A8AA]",
  isNew = false,
  compact = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center justify-between border-b border-[#3a3a3a] bg-[#292929] transition-colors hover:bg-[#323232] ${compact ? "min-h-[80px] px-3.5 py-3" : "rounded-[6px] border border-[#323232] p-4"}`}
    >
      <div className={`flex min-w-0 items-center ${compact ? "gap-3" : "gap-4"}`}>
        {/* Avatar/Icon container */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBgColor}`}
        >
          {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className={`truncate text-white ${compact ? "text-xs" : "text-[14px] font-medium"}`}>{title}</h3>
            {isNew && !compact && (
              <span className="rounded-[4px] border border-[#323232] bg-transparent px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
                NUEVO
              </span>
            )}
          </div>
          <p className={`text-[#A8A8AA] ${compact ? "line-clamp-2 text-[11px] leading-4" : "text-[14px]"}`}>{description}</p>
          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#727272]">
            {time}
          </p>
        </div>
      </div>

      {/* Right chevron */}
      <div className="flex shrink-0 items-center gap-2 text-[#727272]">
        {isNew && compact && <span className="h-1.5 w-1.5 rounded-full bg-[#F78736]" />}
        {!compact && <ChevronRightIcon className="h-5 w-5" />}
      </div>
    </div>
  );
}
