import React from "react";

/**
 * AvailabilityCard — Muestra la disponibilidad horaria del profesional.
 */
export default function AvailabilityCard({ availability }) {
  const schedule = availability?.schedule || [];

  return (
    <div className="flex flex-col gap-3 rounded-[6px] border border-[#323232] bg-[#292929] p-5 sm:p-6 w-full font-sans">
      <h2 className="text-base font-semibold text-white">Disponibilidad</h2>

      {schedule.length === 0 ? (
        <p className="text-xs sm:text-sm text-[#A8A8AA]">
          Sin horarios configurados.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
          {schedule.map((item, idx) => (
            <div
              key={item.day || idx}
              className="flex items-center justify-between border-b border-[#323232] pb-2 last:border-b-0 last:pb-0"
            >
              <span className="text-[#A8A8AA]">{item.day}</span>
              <span className="text-white font-medium">{item.timeRange}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
