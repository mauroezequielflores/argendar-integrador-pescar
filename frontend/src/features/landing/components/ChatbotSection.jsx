const CHATBOT_FEATURES = [
  { label: "Preguntas frecuentes", desc: "Respuestas instantáneas a tus dudas" },
  { label: "Seguimiento",          desc: "Estado de tu solicitud en tiempo real" },
];

export default function ChatbotSection() {
  return (
    <section aria-labelledby="chatbot-heading" className="px-6 py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-2">

        {/* ── Izquierda: texto + lista de funciones ──────────── */}
        <div>
          <h2 id="chatbot-heading" className="mb-4 text-2xl font-semibold text-white">
            ¿Vas a necesitar más ayuda?{" "}
            <span className="whitespace-nowrap">Usa nuestro chatBot.</span>
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400">
            Es ingenioso: podemos facilitarte más partes de tu contratación. Es el
            experto perfecto para ayudarte cuando más lo necesitás y nunca dejará sin
            atención a quien lo necesite.
          </p>

          <ul className="flex flex-col gap-3" role="list" aria-label="Funciones del chatbot">
            {CHATBOT_FEATURES.map(({ label, desc }) => (
              <li
                key={label}
                className="flex items-center gap-4 rounded-[6px] border border-zinc-700 bg-zinc-800/50 p-4"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-orange-500/10"
                  aria-hidden="true"
                >
                  <span className="text-base">💬</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-zinc-400">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Derecha: mockup del chatbot ─────────────────────── */}
        <div className="flex items-center justify-center">
          {/*
            PLACEHOLDER — reemplazar por:
            <img
              src="/images/chatbot-mockup.png"
              alt="Interfaz del chatbot de Argendar en una tablet"
              className="h-[380px] w-full max-w-[400px] rounded-[6px] object-cover"
            />
          */}
          <div
            role="img"
            aria-label="Vista previa del chatbot de Argendar"
            className="flex h-[380px] w-full max-w-[400px] flex-col items-center justify-center gap-3 rounded-[6px] border border-dashed border-zinc-700 bg-zinc-800/50"
          >
            <span className="text-2xl" aria-hidden="true">🤖</span>
            <span className="text-xs text-zinc-500">Imagen: Mockup chatbot</span>
          </div>
        </div>
      </div>
    </section>
  );
}
