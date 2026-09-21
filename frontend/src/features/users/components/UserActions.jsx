import React from "react";
import {
  NoSymbolIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { USER_STATES } from "../constants/users.constants";

/**
 * UserActions — Botones de acción para cada fila/tarjeta de usuario (CA05, CA06, CA08).
 *
 * @param {object} user - Objeto de usuario con id y estado.
 * @param {boolean} disabled - Si es true, desactiva todas las acciones (Panel Administradores - CA08).
 * @param {function} onSuspend - Callback al suspender.
 * @param {function} onActivate - Callback al activar.
 * @param {function} onDelete - Callback al eliminar.
 */
export default function UserActions({
  user,
  disabled = false,
  onSuspend,
  onActivate,
  onDelete,
}) {
  const isSuspended = user.estado === USER_STATES.SUSPENDIDO;
  const isDeleted = user.estado === USER_STATES.ELIMINADO;
  const isActive = user.estado === USER_STATES.ACTIVO;

  if (isDeleted) {
    return (
      <div className="flex items-center justify-end gap-1 text-xs text-[#A8A8AA] italic">
        Cuenta eliminada
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* Botón Activar / Reactivar */}
      {isSuspended && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onActivate && onActivate(user.id)}
          title={disabled ? "Acción no disponible" : "Activar usuario"}
          aria-label="Activar usuario"
          className={`flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#3a3a3a] text-[#A8A8AA] transition-colors hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400 cursor-pointer ${
            disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
          }`}
        >
          <CheckCircleIcon className="h-4 w-4" />
        </button>
      )}

      {/* Botón Suspender */}
      {isActive && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSuspend && onSuspend(user.id)}
          title={disabled ? "Acción no disponible" : "Suspender usuario"}
          aria-label="Suspender usuario"
          className={`flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#3a3a3a] text-[#A8A8AA] transition-colors hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-400 cursor-pointer ${
            disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
          }`}
        >
          <NoSymbolIcon className="h-4 w-4" />
        </button>
      )}

      {/* Botón Eliminar */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDelete && onDelete(user.id)}
        title={disabled ? "Acción no disponible" : "Eliminar usuario"}
        aria-label="Eliminar usuario"
        className={`flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#3a3a3a] text-[#A8A8AA] transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 cursor-pointer ${
          disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
        }`}
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
