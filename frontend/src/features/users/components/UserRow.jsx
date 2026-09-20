import React from "react";
import Badge from "../../../components/ui/Badge";
import UserActions from "./UserActions";
import { USER_STATES } from "../constants/users.constants";

/**
 * Mapa de variantes de Badge según estado del usuario.
 */
const STATUS_BADGE_MAP = {
  [USER_STATES.ACTIVO]: "success",
  [USER_STATES.SUSPENDIDO]: "warning",
  [USER_STATES.ELIMINADO]: "error",
};

/**
 * UserRow — Fila individual de usuario dentro de la tabla (CA05, CA06, CA08).
 *
 * @param {object} user - Objeto de usuario.
 * @param {boolean} isReadOnly - Si es true, desactiva las acciones (panel Administradores).
 * @param {function} onSuspend - Callback para suspender.
 * @param {function} onActivate - Callback para activar.
 * @param {function} onDelete - Callback para eliminar.
 */
export default function UserRow({
  user,
  isReadOnly = false,
  onSuspend,
  onActivate,
  onDelete,
}) {
  const isDeleted = user.estado === USER_STATES.ELIMINADO;
  const isSuspended = user.estado === USER_STATES.SUSPENDIDO;

  return (
    <tr
      className={`border-b border-[#323232]/50 transition-colors ${
        isDeleted
          ? "bg-[#1f1f1f]/50 opacity-60"
          : isSuspended
          ? "bg-[#2a261f]/40 hover:bg-[#323232]/50"
          : "hover:bg-[#323232]/40"
      }`}
    >
      {/* ── ID / N.º de Orden ── */}
      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-white tracking-wider">
        {user.id}
      </td>

      {/* ── Usuario (Nombre + Badge de Estado) ── */}
      <td className="px-4 py-3.5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{user.nombre}</span>
            {user.estado !== USER_STATES.ACTIVO && (
              <Badge variant={STATUS_BADGE_MAP[user.estado] || "default"}>
                {user.estado}
              </Badge>
            )}
          </div>
          {user.email && (
            <span className="text-xs text-[#A8A8AA]">{user.email}</span>
          )}
        </div>
      </td>

      {/* ── Rol ── */}
      <td className="px-4 py-3.5 text-xs text-[#A8A8AA]">
        {user.rol}
      </td>

      {/* ── Fecha ── */}
      <td className="px-4 py-3.5 text-xs text-[#A8A8AA]">
        {user.fecha}
      </td>

      {/* ── Hora ── */}
      <td className="px-4 py-3.5 text-xs text-[#A8A8AA]">
        {user.hora}
      </td>

      {/* ── Acciones ── */}
      <td className="px-4 py-3.5 text-right">
        <UserActions
          user={user}
          disabled={isReadOnly}
          onSuspend={onSuspend}
          onActivate={onActivate}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}
