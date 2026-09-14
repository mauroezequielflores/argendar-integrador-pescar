import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FAQ_ITEMS } from "../data/helpData";

export default function FaqAccordion({ faqRef }) {
  // Manejo de estado independiente por cada pregunta
  const [openItems, setOpenItems] = useState(() =>
    FAQ_ITEMS.filter((item) => item.defaultOpen).map((item) => item.id)
  );

  const toggleItem = (id) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section ref={faqRef} className="flex flex-col gap-3">
      <h2 className="text-sm sm:text-base font-semibold text-white">
        Preguntas Frecuentes
      </h2>

      <div className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openItems.includes(item.id);
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-[6px] border border-[#323232] bg-[#292929] transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#323232]/50 cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 shrink-0 text-[#A8A8AA] transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-[#323232] px-4 pb-4 pt-3 text-xs text-[#A8A8AA] leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
