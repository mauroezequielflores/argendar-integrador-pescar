import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { QUICK_SHORTCUTS } from "../data/helpData";

export default function QuickShortcuts() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm sm:text-base font-semibold text-white">
        Atajos Rápidos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {QUICK_SHORTCUTS.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <button
              key={shortcut.id}
              type="button"
              onClick={() => navigate(shortcut.to)}
              className="group flex items-center justify-between rounded-[6px] border border-[#323232] bg-[#292929] p-4 text-left transition-colors hover:border-[#555] cursor-pointer"
            >
              <div className="flex items-start gap-3.5 pr-2">
                <div className="mt-0.5 text-[#A8A8AA] group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-tight">
                    {shortcut.title}
                  </p>
                  <p className="mt-1 text-xs text-[#A8A8AA] leading-snug">
                    {shortcut.description}
                  </p>
                </div>
              </div>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-[#A8A8AA] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
