import React from "react";
import UserRow from "./UserRow";

const TABLE_HEADERS = [
  { key: "id", label: "ID", className: "w-32" },
  { key: "usuario", label: "USUARIO" },
  { key: "rol", label: "ROL", className: "w-28" },
  { key: "fecha", label: "FECHA", className: "w-28" },
  { key: "hora", label: "HORA", className: "w-28" },
  { key: "acciones", label: "ACCIONES", className: "w-36 text-right" },
];

/**
 * UsersTable — Tabla estructurada para listado de usuarios según captura de diseño.
 *
 * @param {Array} users - Lista de usuarios a renderizar.
 * @param {boolean} isReadOnly - Indica si las acciones deben estar deshabilitadas (Administradores).
 * @param {function} onSuspend - Callback al suspender un usuario.
 * @param {function} onActivate - Callback al activar un usuario.
 * @param {function} onDelete - Callback al eliminar un usuario.
 */
export default function UsersTable({
  users = [],
  isReadOnly = false,
  onSuspend,
  onActivate,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-[6px] border border-[#323232] bg-[#292929]">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-[#A8A8AA]">
          <thead className="border-b border-[#323232] bg-[#242424]/60 text-xs font-semibold uppercase tracking-wider text-[#A8A8AA]">
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header.key}
                  scope="col"
                  className={`px-4 py-3.5 ${header.className || ""}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#323232]/50">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isReadOnly={isReadOnly}
                onSuspend={onSuspend}
                onActivate={onActivate}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
