import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

const STEPS = [
  {
    num: "1",
    title: "Publicá tu solicitud",
    desc: "Describí el trabajo, indicá la ubicación y tu presupuesto.",
    imgLabel: "Paso 1: Publicar solicitud",
  },
  {
    num: "2",
    title: "Recibí tu oferta",
    desc: "Profesionales verificados te envían sus propuestas al instante.",
    imgLabel: "Paso 2: Recibir oferta",
  },
  {
    num: "3",
    title: "Compará y Elegí",
    desc: "Revisá perfiles, reseñas y precios. Elegí el mejor.",
    imgLabel: "Paso 3: Comparar y elegir",
  },
  {
    num: "4",
    title: "Confirmá turno",
    desc: "Coordiná día y hora directamente con el profesional.",
    imgLabel: "Paso 4: Confirmar turno",
  },
  {
    num: "5",
    title: "Calificá",
    desc: "Terminado el trabajo, valorá la experiencia con una reseña.",
    imgLabel: "Paso 5: Calificar el servicio",
  },
];

export default function HowItWorksSection() {
  const navigate = useNavigate();

  return (
    <>
      {/* Sección pasos */}
      <section id="como-funciona" aria-labelledby="como-funciona-heading" className="bg-[#161616] px-6 py-20">
        <div className="mx-auto max-w-[1200px]">

          {/* Encabezado */}
          <div className="mb-14 text-center">
            <h2 id="como-funciona-heading" className="text-2xl font-semibold text-white">
              En Argendar, así de simple es contratar a un profesional
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              Cinco pasos para que tu casa siempre quede en orden
            </p>
          </div>

          {/* Lista numerada de pasos */}
          <ol
            className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5"
            aria-label="Pasos para contratar un profesional en Argendar"
          >
            {STEPS.map(({ num, title, desc, imgLabel }) => (
              <li key={num} className="flex flex-col items-center gap-4 text-center">
                {/* Número decorativo */}
                <span className="text-5xl font-bold leading-none text-orange-500/25" aria-hidden="true">
                  {num}
                </span>

                {/*
                  PLACEHOLDER — reemplazar por:
                  <img src={`/images/steps/step-${num}.png`} alt={imgLabel}
                       className="h-[100px] w-full rounded-[6px] object-cover" />
                */}
                <div
                  role="img"
                  aria-label={imgLabel}
                  className="flex h-[100px] w-full items-center justify-center rounded-[6px] border border-dashed border-zinc-700 bg-zinc-800/50"
                >
                  <span className="text-xs text-zinc-600" aria-hidden="true">{imgLabel}</span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-xs text-zinc-400">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Banner CTA naranja (CA06) */}
      <aside aria-label="Llamado a la acción" className="bg-orange-500 px-6 py-10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-lg font-semibold text-white">
            ¿Necesitás resolver algo en tu hogar? Empezá ahora.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="shrink-0 rounded-[6px] bg-[#1a1a1a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Publicar solicitud
          </button>
        </div>
      </aside>
    </>
  );
}
