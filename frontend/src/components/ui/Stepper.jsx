import React from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

/**
 * Stepper — Indicador de progreso gráfico.
 */
export default function Stepper({ steps = [], currentStep = 1, className = "" }) {
  return (
    <div className={`relative flex items-start justify-between w-full max-w-2xl mx-auto ${className}`}>
      {/* Línea conectora absoluta de fondo */}
      <div className="absolute top-4 left-0 w-full h-[1px] bg-[#3f3f3f] -z-0"></div>

      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isPast = stepNum < currentStep;

        return (
          <div key={step} className="flex flex-col items-center gap-2 relative z-10 w-24">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors
                ${
                  isActive
                    ? "bg-[#3f3f3f] text-white ring-2 ring-white"
                    : isPast
                    ? "bg-[#3f3f3f] text-white"
                    : "bg-[#202020] text-[#A8A8AA] border border-[#3f3f3f]"
                }
              `}
            >
              {isPast ? <CheckIcon className="h-4 w-4 stroke-2" /> : stepNum}
            </div>
            <span
              className={`text-[10px] font-bold tracking-widest uppercase text-center bg-[#292929] px-1
                ${isActive || isPast ? "text-white" : "text-[#A8A8AA]"}
              `}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
