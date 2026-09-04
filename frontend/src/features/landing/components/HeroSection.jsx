export default function HeroSection() {

  return (
    <section id="hero" aria-labelledby="hero-heading" className="bg-[#161618] px-6 py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-12">

        {/* ── Columna izquierda (8/12) ───────────────────────── */}
        <div className="space-y-8 lg:col-span-8">

          {/* Headline + subtítulo */}
          <div className="space-y-4">
            <h1
              id="hero-heading"
              className="text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl"
            >
              Encontrá al profesional que necesitás para tu hogar.
            </h1>
            <p className="max-w-3xl text-base font-normal leading-relaxed text-zinc-400 sm:text-lg md:text-[19px]">
              Publicá tu solicitud, recibí ofertas de plomeros, electricistas y frigoristas
              matriculados en tu zona, y elegí la que más te convenga.
            </p>
          </div>

          {/* Tarjetas de rol */}
          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2" role="group" aria-label="Seleccioná tu rol">

            {/* SOY CLIENTE */}
            <article
              className="rounded-2xl border border-zinc-700 bg-transparent p-8"
              aria-label="Soy cliente — busco un profesional"
            >
              <span className="mb-4 block text-xs font-bold uppercase tracking-wider text-orange-500">
                SOY CLIENTE
              </span>
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Busco un profesional
              </h2>
              <p className="text-base leading-relaxed text-zinc-400">
                Navegá por nuestra agenda, compará profesionales por reseñas y enviá
                solicitudes que más se acomoden a tu problema.
              </p>
            </article>

            {/* SOY PROFESIONAL */}
            <article
              className="rounded-2xl border border-zinc-700 bg-transparent p-8"
              aria-label="Soy profesional — ofrezco un servicio"
            >
              <span className="mb-4 block text-xs font-bold uppercase tracking-wider text-orange-500">
                SOY PROFESIONAL
              </span>
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ofrezco un servicio
              </h2>
              <p className="text-base leading-relaxed text-zinc-400">
                Armá tu perfil profesional, publicá tus ofertas, disponibilidad, recibí
                notificaciones y organizá tu agenda de turnos todo en un solo lugar.
              </p>
            </article>
          </div>
        </div>

        {/* ── Columna derecha (4/12): imagen inclinada ───────── */}
        <div className="mt-8 flex items-center justify-center lg:col-span-4 lg:mt-0 lg:justify-end">
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-none [perspective:1200px]">

            {/*
              PLACEHOLDER — reemplazar este div por:
              <img
                src="/images/hero-mockup.png"
                alt="Vista previa de la app Argendar en un teléfono"
                className="w-full h-full object-cover rounded-2xl"
              />
            */}
            <div
              id="hero-image-placeholder"
              role="img"
              aria-label="Vista previa de la app Argendar"
              className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl border border-zinc-700 bg-[#1c1c1f] text-center text-sm text-zinc-600 shadow-2xl [transform:rotateY(-18deg)_rotateX(6deg)_rotateZ(2deg)]"
            >
              Imagen del mockup acá
            </div>

            {/* Glow decorativo — oculto para lectores de pantalla */}
            <div className="absolute -inset-10 -z-10 rounded-full bg-orange-500/10 blur-3xl" aria-hidden="true" />
          </div>
        </div>

      </div>
    </section>
  );
}
