const SECTIONS = [
  {
    id: "marketplace",
    title: "Marketplace de profesionales",
    desc: "Explorá perfiles, calificaciones y disponibilidad horaria de cada uno.",
    imgLabel: "Captura de pantalla del Marketplace de profesionales",
  },
  {
    id: "agenda",
    title: "Mi Agenda",
    desc: "Gestioná tus turnos confirmados, historial de servicios y próximas visitas en un solo lugar.",
    imgLabel: "Captura de pantalla de Mi Agenda",
  },
  {
    id: "profile",
    title: "Perfil verificado",
    desc: "Revisá el perfil completo del profesional con datos verificados antes de cerrar el trato.",
    imgLabel: "Captura de pantalla del Perfil verificado",
  },
];

export default function MainSectionsSection() {
  return (
    <section aria-labelledby="secciones-heading" className="px-6 py-20">
      <div className="mx-auto max-w-[1200px]">

        {/* Encabezado */}
        <div className="mb-12 text-center">
          <h2 id="secciones-heading" className="text-2xl font-semibold text-white">
            Secciones Principales
          </h2>
          <p className="mx-auto mt-3 max-w-[500px] text-sm text-zinc-400">
            Todo lo que necesitás para gestionar tus servicios en casa de visita.
          </p>
        </div>

        {/* Cards */}
        <ul className="grid gap-4 sm:grid-cols-3" role="list" aria-label="Funcionalidades principales de la plataforma">
          {SECTIONS.map(({ id, title, desc, imgLabel }) => (
            <li
              key={id}
              className="flex flex-col overflow-hidden rounded-[6px] border border-zinc-700 bg-zinc-800/50 transition-all duration-200 hover:scale-[1.02] hover:border-orange-500"
            >
              {/*
                PLACEHOLDER — reemplazar por:
                <img src={`/images/sections/${id}.png`} alt={imgLabel}
                     className="h-[180px] w-full object-cover" />
              */}
              <div
                role="img"
                aria-label={imgLabel}
                className="flex h-[180px] w-full items-center justify-center border-b border-zinc-700 bg-zinc-900"
              >
                <span className="text-xs text-zinc-600" aria-hidden="true">{imgLabel}</span>
              </div>

              <div className="p-5">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-xs text-zinc-400">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
