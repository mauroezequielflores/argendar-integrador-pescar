import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "../../../constants/routes";

const NAV_ITEMS = [
  { label: "Servicios",      anchor: "servicios" },
  { label: "Cómo funciona", anchor: "como-funciona" },
  { label: "Beneficios",    anchor: "beneficios" },
  { label: "FAQ",           anchor: "faq" },
];

export default function LandingHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (anchor) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-800 bg-[#161618]" role="banner">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* Logo */}
        <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded" aria-label="Argendar — inicio">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500" aria-hidden="true">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <span className="text-base font-bold text-white">Argendar</span>
        </a>

        {/* Nav — desktop */}
        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-7" role="list">
            {NAV_ITEMS.map(({ label, anchor }) => (
              <li key={anchor}>
                <button
                  type="button"
                  onClick={() => scrollTo(anchor)}
                  className="text-sm text-zinc-400 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botones — desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ROLE_SELECTION)}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Registrarme ahora
          </button>
        </div>

        {/* Hamburguesa — mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 md:hidden"
        >
          {menuOpen
            ? <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            : <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          }
        </button>
      </div>

      {/* Menú mobile */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-zinc-800 bg-[#161618] px-6 pb-4 md:hidden"
      >
        <nav aria-label="Navegación mobile">
          <ul className="flex flex-col gap-1 pt-3" role="list">
            {NAV_ITEMS.map(({ label, anchor }) => (
              <li key={anchor}>
                <button
                  type="button"
                  onClick={() => scrollTo(anchor)}
                  className="w-full rounded-lg py-2.5 text-left text-sm text-zinc-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => { navigate(ROUTES.LOGIN); setMenuOpen(false); }}
            className="w-full rounded-lg border border-zinc-600 py-2.5 text-sm font-medium text-white hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => { navigate(ROUTES.ROLE_SELECTION); setMenuOpen(false); }}
            className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-bold text-white hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Registrarme ahora
          </button>
        </div>
      </div>
    </header>
  );
}
