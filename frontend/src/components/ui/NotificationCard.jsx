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
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between cursor-pointer rounded-[6px] border border-[#323232] bg-[#292929] p-4 transition-colors hover:bg-[#323232]"
    >
      <div className="flex items-center gap-4">
        {/* Avatar/Icon container */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBgColor}`}
        >
          {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-medium text-white">{title}</h3>
            {isNew && (
              <span className="rounded-[4px] border border-[#323232] bg-transparent px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
                NUEVO
              </span>
            )}
          </div>
          <p className="text-[14px] text-[#A8A8AA]">{description}</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#727272]">
            {time}
          </p>
        </div>
      </div>

      {/* Right chevron */}
      <div className="shrink-0 text-[#727272]">
        <ChevronRightIcon className="h-5 w-5" />
      </div>
    </div>
  );
}
