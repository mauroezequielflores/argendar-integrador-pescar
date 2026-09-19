import React from "react";
import { INQUIRY_STATES } from "../constants/reports.constants";

/**
 * InquiryRow — Fila individual de una consulta en la tabla de soporte.
 *
 * @param {object} inquiry - Objeto de consulta.
 * @param {function} onSelect - Callback al hacer clic en la fila para ver detalle.
 */
export default function InquiryRow({ inquiry, onSelect }) {
  const isPending = inquiry.estado === INQUIRY_STATES.PENDING;

  // Iniciales o avatar de usuario
  const initials = inquiry.usuario
    ? inquiry.usuario
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <tr
      onClick={() => onSelect && onSelect(inquiry)}
      className="border-b border-[#323232]/50 transition-colors hover:bg-[#323232]/40 cursor-pointer"
    >
      {/* ── Fecha ── */}
      <td className="px-4 py-4 text-xs text-[#A8A8AA] whitespace-nowrap">
        {inquiry.fecha}
      </td>

      {/* ── Usuario con Avatar Circular ── */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#202020]">
            {initials}
          </div>
          <span className="text-sm font-medium text-white truncate max-w-[180px]">
            {inquiry.usuario}
          </span>
        </div>
      </td>

      {/* ── Rol ── */}
      <td className="px-4 py-4 text-xs text-[#A8A8AA]">
        {inquiry.rol}
      </td>

      {/* ── Asunto ── */}
      <td className="px-4 py-4 text-xs text-[#A8A8AA] truncate max-w-[280px]">
        {inquiry.asunto}
      </td>

      {/* ── Estado ── */}
      <td className="px-4 py-4 text-right whitespace-nowrap">
        {isPending ? (
          <span className="inline-flex items-center rounded-[6px] border border-[#555] bg-transparent px-3 py-1 text-[11px] font-semibold text-white tracking-wider">
            PENDIENTE
          </span>
        ) : (
          <span className="inline-flex items-center rounded-[6px] border border-green-500/40 bg-green-500/20 px-3 py-1 text-[11px] font-semibold text-green-400 tracking-wider">
            RESPONDIDA
          </span>
        )}
      </td>
    </tr>
  );
}
