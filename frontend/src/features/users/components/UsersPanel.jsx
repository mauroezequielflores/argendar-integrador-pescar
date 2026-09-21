import React from "react";
import SearchInput from "../../../components/ui/SearchInput";
import UsersTable from "./UsersTable";
import UsersEmptyState from "./UsersEmptyState";
import { TAB_CONFIG } from "../constants/users.constants";

/**
 * UsersPanel — Contenedor de un panel de usuarios (Profesionales / Clientes / Administradores).
 *
 * @param {string} panelKey - Clave del panel ("profesionales" | "clientes" | "administradores").
 * @param {Array} users - Lista de usuarios filtrados para este panel.
 * @param {string} searchTerm - Término de búsqueda actual para este panel.
 * @param {function} onSearchChange - Callback al cambiar la búsqueda.
 * @param {function} onSuspend - Callback al suspender.
 * @param {function} onActivate - Callback al activar.
 * @param {function} onDelete - Callback al eliminar.
 */
export default function UsersPanel({
  panelKey,
  users = [],
  searchTerm = "",
  onSearchChange,
  onSuspend,
  onActivate,
  onDelete,
}) {
  const config = TAB_CONFIG[panelKey] || {
    pluralLabel: "usuarios",
    searchPlaceholder: "Buscar por número de orden...",
    emptyTitle: "No hay usuarios registrados",
    emptyDescription: "No encontramos usuarios para mostrar en este momento.",
  };

  const isReadOnly = panelKey === "administradores";
  const hasSearch = searchTerm.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Barra de Búsqueda Independiente (CA04) ── */}
      <div>
        <SearchInput
          value={searchTerm}
          onChange={(e) => onSearchChange(panelKey, e.target.value)}
          placeholder={config.searchPlaceholder}
          className="w-full"
        />
      </div>

      {/* ── Contador Contextual (CA02) ── */}
      <div>
        <p className="text-sm font-semibold text-white">
          Se encontraron {users.length} {config.pluralLabel}
        </p>
      </div>

      {/* ── Contenido: Tabla o Empty State (CA05, CA07, CA08) ── */}
      {users.length > 0 ? (
        <UsersTable
          users={users}
          isReadOnly={isReadOnly}
          onSuspend={(id) => onSuspend(panelKey, id)}
          onActivate={(id) => onActivate(panelKey, id)}
          onDelete={(id) => onDelete(panelKey, id)}
        />
      ) : (
        <UsersEmptyState
          title={hasSearch ? "No se encontraron resultados" : config.emptyTitle}
          description={
            hasSearch
              ? `No encontramos usuarios que coincidan con "${searchTerm}".`
              : config.emptyDescription
          }
        />
      )}
    </div>
  );
}
