import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import ModerationCard from "./ModerationCard";
import { useModerationPanel } from "../hooks/useModerationPanel";

/**
 * EMPTY_STATE_CONFIG — Texto contextualizado por panel (CA06).
 */
const EMPTY_STATE_CONFIG = {
  solicitudes: {
    icon: "📋",
    title: "No hay solicitudes para moderar",
    description:
      "Parece que estás al día. Todas las solicitudes pendientes han sido procesadas correctamente.",
    showRefresh: false,
  },
  ofertas: {
    icon: "🏪",
    title: "No hay ofertas para moderar",
    description:
      "Por el momento no hay nuevas ofertas que requieran revisión. Las nuevas solicitudes aparecerán en esta lista.",
    showRefresh: false,
  },
  calificaciones: {
    icon: "⭐",
    title: "No hay calificaciones",
    description:
      "Cuando los usuarios califiquen sus experiencias, aparecerán aquí para tu revisión.",
    showRefresh: false,
  },
  turnos: {
    icon: "📅",
    title: "No hay turnos para moderar",
    description:
      "Actualmente no hay turnos registrados en la plataforma. Los nuevos turnos aparecerán en esta lista automáticamente.",
    showRefresh: true,
  },
};

const PANEL_LABEL = {
  solicitudes: "solicitudes",
  ofertas: "ofertas",
  calificaciones: "calificaciones",
  turnos: "turnos",
};

/**
 * ModerationPanel — Panel con buscador, contador y lista de tarjetas (CA03, CA04, CA06).
 *
 * @param {"solicitudes"|"ofertas"|"calificaciones"|"turnos"} panelKey
 */
export default function ModerationPanel({ panelKey }) {
  const {
    filteredItems,
    items,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    activateItem,
    disableItem,
    deleteItem,
    refetch,
  } = useModerationPanel(panelKey);

  const emptyConfig = EMPTY_STATE_CONFIG[panelKey] || EMPTY_STATE_CONFIG.solicitudes;
  const label = PANEL_LABEL[panelKey] || panelKey;

  // ── Barra de búsqueda + contador ──────────────────────────────────────────
  const searchBar = (
    <div className="flex items-center justify-between gap-4">
      {/* Input de búsqueda */}
      <div className="relative w-full max-w-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-4 w-4 text-[#A8A8AA]" />
        </div>
        <input
          id={`search-${panelKey}`}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por número de orden..."
          className="w-full rounded-[6px] border border-[#323232] bg-[#292929] py-2 pl-9 pr-3 text-sm text-white placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none focus:ring-1 focus:ring-[#F78736]"
        />
      </div>

      {/* Contador */}
      <span className="shrink-0 text-xs text-[#A8A8AA]">
        Mostrando {filteredItems.length} de {items.length} {label}
      </span>
    </div>
  );

  // ── Error (CA06) ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-4">
        {searchBar}
        <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 rounded-[12px] bg-[#202020] p-6 text-center">
          <p className="text-sm font-semibold text-red-400">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center gap-2 rounded-[6px] bg-[#323232] px-4 py-2 text-xs font-semibold text-[#A8A8AA] transition-colors hover:bg-[#3a3a3a] hover:text-white"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ── Carga (CA06) ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        {searchBar}
        <div className="flex min-h-[380px] items-center justify-center rounded-[12px] bg-[#202020]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F78736] border-t-transparent" />
        </div>
      </div>
    );
  }

  // ── Contenido ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {searchBar}

      {/* Área de tarjetas o empty state */}
      <div className="min-h-[380px] rounded-[12px] bg-[#202020] p-4">
        {filteredItems.length === 0 ? (
          /* ── Empty State (CA06) ──────────────────────────────── */
          <div className="flex h-full min-h-[340px] flex-col items-center justify-center gap-3 text-center">
            {/* Ícono contextualizado */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#292929] border border-[#323232] text-2xl">
              {searchQuery.trim() ? "🔍" : emptyConfig.icon}
            </div>

            <h3 className="text-base font-bold text-white">
              {searchQuery.trim()
                ? "Sin resultados"
                : emptyConfig.title}
            </h3>

            <p className="max-w-xs text-xs text-[#A8A8AA] leading-relaxed">
              {searchQuery.trim()
                ? `No se encontraron ${label} con el ID "${searchQuery}".`
                : emptyConfig.description}
            </p>

            {/* Botón "Actualizar lista" solo en Turnos (según captura) */}
            {!searchQuery.trim() && emptyConfig.showRefresh && (
              <button
                onClick={refetch}
                className="mt-2 flex items-center gap-2 rounded-[6px] border border-[#323232] bg-transparent px-4 py-2 text-xs font-semibold text-[#A8A8AA] transition-colors hover:bg-[#323232] hover:text-white"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Actualizar lista
              </button>
            )}
          </div>
        ) : (
          /* ── Lista de tarjetas (CA04) ────────────────────────── */
          <div className="flex flex-col gap-3">
            {filteredItems.map((item) => (
              <ModerationCard
                key={item.id}
                item={item}
                onActivate={activateItem}
                onDisable={disableItem}
                onDelete={deleteItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
