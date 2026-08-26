import Badge from "../../../components/ui/Badge";
import { MODERATION_STATES } from "../data/mockModerationData";
import {
  NoSymbolIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

/**
 * Mapa de variante de Badge según estado del elemento.
 */
const STATE_BADGE_VARIANT = {
  [MODERATION_STATES.ACTIVE]: "success",
  [MODERATION_STATES.DISABLED]: "warning",
  [MODERATION_STATES.DELETED]: "error",
};

/**
 * ModerationCard — Tarjeta individual de un elemento a moderar (CA04, CA05).
 *
 * Muestra: ID, badge de estado, título, descripción, usuario y tres acciones:
 * Eliminar (🗑), Activar (✓), Desactivar (🚫).
 *
 * @param {object}   item
 * @param {function} onActivate  - Callback al activar
 * @param {function} onDisable   - Callback al desactivar
 * @param {function} onDelete    - Callback al eliminar
 */
export default function ModerationCard({ item, onActivate, onDisable, onDelete }) {
  const isDeleted = item.estado === MODERATION_STATES.DELETED;

  return (
    <div
      className={`flex items-center gap-4 rounded-[8px] border p-4 transition-colors ${
        isDeleted
          ? "border-[#3a3a3a] bg-[#1a1a1a] opacity-60"
          : "border-[#323232] bg-[#292929] hover:border-[#3a3a3a]"
      }`}
    >
      {/* ── Avatar genérico ─────────────────────────────── */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#323232]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-[#A8A8AA]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </div>

      {/* ── Contenido principal ─────────────────────────── */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        {/* Fila ID + Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#F78736] tracking-wider">
            #{item.id}
          </span>
          <Badge variant={STATE_BADGE_VARIANT[item.estado] || "default"}>
            {item.estado}
          </Badge>
        </div>

        {/* Título */}
        <p className="text-sm font-semibold text-white leading-snug truncate">
          {item.titulo}
        </p>

        {/* Descripción */}
        {item.descripcion && (
          <p className="text-xs text-[#A8A8AA] leading-snug line-clamp-1">
            {item.descripcion}
          </p>
        )}

        {/* Usuario */}
        <p className="text-xs text-[#A8A8AA]">
          <span className="font-semibold text-[#727272]">
            {item.tipoUsuario}:{" "}
          </span>
          <span className="text-white">{item.usuario}</span>
        </p>
      </div>

      {/* ── Acciones (CA04, CA05) ────────────────────────── */}
      {!isDeleted && (
        <div className="flex shrink-0 items-center gap-1">
          {/* Desactivar */}
          <button
            title="Desactivar"
            onClick={() => onDisable(item.id)}
            disabled={item.estado === MODERATION_STATES.DISABLED}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#A8A8AA] transition-colors hover:bg-[#323232] hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <NoSymbolIcon className="h-4 w-4" />
          </button>

          {/* Activar */}
          <button
            title="Activar"
            onClick={() => onActivate(item.id)}
            disabled={item.estado === MODERATION_STATES.ACTIVE}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#A8A8AA] transition-colors hover:bg-[#323232] hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircleIcon className="h-4 w-4" />
          </button>

          {/* Eliminar */}
          <button
            title="Eliminar"
            onClick={() => onDelete(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#A8A8AA] transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
