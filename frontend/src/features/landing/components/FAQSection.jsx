import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    q: "¿Cómo elijo la mejor oferta?",
    a: "Podés comparar cada propuesta de profesional revisando su perfil, calificaciones, historial de trabajos y precio. Tenés toda la información necesaria antes de decidir.",
  },
  {
    id: "faq-2",
    q: "¿Cómo sé que el profesional es confiable?",
    a: "Todos los profesionales pasan por un proceso de verificación de identidad y matriculación. Además, contás con reseñas reales de clientes anteriores para validar su reputación.",
  },
  {
    id: "faq-3",
    q: "¿Puedo cancelar una solicitud sin cargo?",
    a: "Sí. Podés cancelar una solicitud antes de que el profesional inicie el trabajo. Si ya fue confirmado el turno, la política de cancelación dependerá del profesional y del tipo de servicio.",
  },
  {
    id: "faq-4",
    q: "¿Cómo funciona el sistema de pagos?",
    a: "El pago queda retenido en la plataforma hasta que confirmás que el trabajo fue completado correctamente. Podés pagar con Mercado Pago, transferencia o efectivo según el profesional.",
  },
];

/** Ítem de acordeón accesible (CA11) */
function FAQItem({ id, q, a }) {
  const [open, setOpen] = useState(false);
  const panelId = `${id}-panel`;

  return (
    <div className="border-b border-zinc-700 last:border-b-0">
      <h3>
        <button
          type="button"
          id={id}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
        >
          <span className="text-sm font-semibold text-white">{q}</span>
          <ChevronDownIcon
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-300"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={id}
        hidden={!open}
        className="pb-5"
      >
        <p className="text-sm leading-relaxed text-zinc-400">{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="px-6 py-20">
      <div className="mx-auto max-w-[800px]">

        {/* Encabezado */}
        <div className="mb-10 text-center">
          <h2 id="faq-heading" className="text-2xl font-semibold text-white">
            Preguntas frecuentes
          </h2>
        </div>

        {/* Acordeón */}
        <div
          className="rounded-[6px] border border-zinc-700 bg-zinc-800/50 px-6"
          role="list"
          aria-label="Preguntas y respuestas frecuentes"
        >
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
