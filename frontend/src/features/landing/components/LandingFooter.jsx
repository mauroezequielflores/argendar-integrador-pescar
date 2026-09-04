const FOOTER_COLUMNS = [
  {
    title: "Empresa",
    links: ["Sobre Argendar", "Cómo funciona", "Prensa", "Empleos", "Blog"],
  },
  {
    title: "Cuenta",
    links: ["Iniciar sesión", "Registrarme", "Mi perfil", "Configuración"],
  },
  {
    title: "Soporte",
    links: ["Centro de ayuda", "Términos de uso", "Privacidad", "Contacto"],
  },
  {
    title: "Síguenos",
    links: ["Instagram", "Facebook", "Twitter / X", "LinkedIn"],
  },
];

/** Footer de la landing page. Links deshabilitados (CA08) — color #DADADA. */
export default function LandingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-900 px-6 py-14" role="contentinfo">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500" aria-hidden="true">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <span className="text-base font-bold text-white">Argendar</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              La plataforma que conecta clientes con profesionales verificados en toda Argentina.
            </p>
          </div>

          {/* Columnas de links (CA08 — deshabilitados sin funcionalidad) */}
          {FOOTER_COLUMNS.map(({ title, links }) => (
            <nav key={title} aria-label={`Links de ${title}`}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
                {title}
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {links.map((link) => (
                  <li key={link}>
                    {/* Links deshabilitados — aria-disabled + tabIndex para indicar estado */}
                    <span
                      role="link"
                      aria-disabled="true"
                      tabIndex={-1}
                      className="cursor-default text-sm"
                      style={{ color: "#DADADA" }}
                    >
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-800 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-400">
            © 2026 Argendar. Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-400" aria-hidden="true">Hecho con ♥ en Argentina</p>
        </div>
      </div>
    </footer>
  );
}
