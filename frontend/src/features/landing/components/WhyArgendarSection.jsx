import { useState } from "react";
import { StarIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

/* ─── Mini-mockups de UI ──────────────────────────────────────── */

function OfferCard() {
  return (
    <div className="rounded-[6px] border border-zinc-700 bg-zinc-900 p-4" aria-label="Ejemplo de oferta de profesional" role="img">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-700" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-white">Marcos Paje</p>
          <div className="mt-0.5 flex items-center gap-1" aria-label="Calificación: 4 de 5 estrellas" role="img">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                aria-hidden="true"
                className={`h-3 w-3 ${i < 4 ? "fill-orange-500 text-orange-500" : "text-zinc-700"}`}
              />
            ))}
            <span className="ml-1 text-xs text-zinc-400">4.0</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" aria-label="Ver perfil de Marcos Paje" className="flex-1 rounded-[6px] border border-zinc-600 py-1.5 text-xs text-zinc-400 hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500">
          Ver perfil
        </button>
        <button type="button" aria-label="Contratar a Marcos Paje" className="flex-1 rounded-[6px] bg-orange-500 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
          Contratar
        </button>
      </div>
    </div>
  );
}

function FiltersMockup() {
  return (
    <div className="rounded-[6px] border border-zinc-700 bg-zinc-900 p-4" aria-label="Ejemplo de filtros de búsqueda" role="img">
      <div className="mb-3 flex flex-wrap gap-2" aria-hidden="true">
        {["Rubro", "Categoría", "Ubicación"].map((f) => (
          <span key={f} className="rounded-full border border-zinc-600 px-3 py-1 text-xs text-zinc-400">{f}</span>
        ))}
      </div>
      <div className="rounded-[6px] border border-zinc-700 bg-zinc-800 p-3" aria-hidden="true">
        <p className="text-xs font-semibold text-white">Plomero — Centro</p>
        <p className="mt-1 text-xs text-zinc-400">Disponible hoy · 3 ofertas</p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-700">
          <div className="h-1.5 w-2/3 rounded-full bg-orange-500" />
        </div>
      </div>
    </div>
  );
}

function PaymentMockup() {
  const methods = ["Mercado Pago", "Efectivo", "Transferencia"];
  return (
    <div className="rounded-[6px] border border-zinc-700 bg-zinc-900 p-4" aria-label="Métodos de pago disponibles" role="img">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400" aria-hidden="true">
        Método de pago
      </p>
      <ul className="flex flex-col gap-2" aria-hidden="true">
        {methods.map((method) => (
          <li key={method} className="flex items-center gap-3 rounded-[6px] border border-zinc-700 bg-zinc-800 px-3 py-2">
            <div className="h-5 w-5 rounded-full border border-orange-500/40 bg-orange-500/10" />
            <span className="text-xs text-white">{method}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VerifiedProfMockup() {
  return (
    <div className="rounded-[6px] border border-zinc-700 bg-zinc-900 p-4" aria-label="Ejemplo de profesional verificado" role="img">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-700" aria-hidden="true" />
        <div>
          <div className="flex items-center gap-1">
            <p className="text-xs font-semibold text-white">Mario García</p>
            <CheckBadgeIcon className="h-4 w-4 text-orange-500" aria-hidden="true" />
          </div>
          <p className="text-xs text-zinc-400">Electricista · 5 años de exp.</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2" aria-hidden="true">
        <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">Matriculado</span>
        <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">Verificado</span>
        <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">Asegurado</span>
      </div>
    </div>
  );
}

/* ─── Bloque de feature con rotate al hover (CA10) ───────────── */

function FeatureBlock({ title, desc, mockup, reverse = false }) {
  const [rotate, setRotate] = useState(0);

  return (
    <article
      onMouseEnter={() => setRotate(5.5)}
      onMouseLeave={() => setRotate(0)}
      style={{ transform: `rotate(${rotate}deg)`, transition: "transform 0.3s ease" }}
      className="flex flex-col gap-5 rounded-[6px] border border-zinc-700 bg-zinc-800/50 p-6"
    >
      {reverse ? (
        <>
          {mockup}
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">{desc}</p>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">{desc}</p>
          </div>
          {mockup}
        </>
      )}
    </article>
  );
}

/* ─── Data ────────────────────────────────────────────────────── */

const FEATURES = [
  {
    title: "Cambio de talento principal.",
    desc: "Recibí ofertas personalizadas de profesionales especializados. Comparalos y elegí el que mejor se adapte a tu necesidad.",
    mockup: <OfferCard />,
    reverse: false,
  },
  {
    title: "Solicitudes personalizadas.",
    desc: "Contá con una herramienta que filtra por categoría, calificación, ubicación y fecha de preferencia. Siempre fuera del problema.",
    mockup: <FiltersMockup />,
    reverse: true,
  },
  {
    title: "Pago seguro, a tu manera.",
    desc: "Pagá con Mercado Pago para asegurar tu dinero hasta después de evaluar el servicio. También podés pagar en efectivo o por transferencia.",
    mockup: <PaymentMockup />,
    reverse: false,
  },
  {
    title: "Profesionales matriculados y verificados.",
    desc: "Matriculados, verificados y calificados por miles de otros clientes. No te arriesgues, contratá solo los que confías.",
    mockup: <VerifiedProfMockup />,
    reverse: true,
  },
];

/* ─── Sección principal ───────────────────────────────────────── */

export default function WhyArgendarSection() {
  return (
    <section id="beneficios" aria-labelledby="beneficios-heading" className="bg-[#181818] px-6 py-20">
      <div className="mx-auto max-w-[1200px]">

        {/* Encabezado */}
        <div className="mb-12 text-center">
          <h2 id="beneficios-heading" className="text-2xl font-semibold text-white">
            ¿Por qué elegir Argendar?
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-sm text-zinc-400">
            Tendrías lo que necesitás en el bolsillo siempre.
          </p>
        </div>

        {/* Grilla 2×2 */}
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <FeatureBlock key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
