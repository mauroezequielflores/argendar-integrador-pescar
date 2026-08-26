import { useState } from "react";
import {
  MagnifyingGlassIcon,
  CreditCardIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import DataTable from "../../../components/ui/DataTable";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";

import { mockTransactions } from "../data/mockTransactions";
import { ROUTES } from "../../../constants/routes";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusVariant(estado) {
  switch (estado.toUpperCase()) {
    case "COMPLETADO":
      return "success";
    case "PENDIENTE":
      return "warning";
    case "CANCELADO":
      return "error";
    case "REEMBOLSADO":
    default:
      return "default";
  }
}

function formatFecha(fechaISO) {
  const d = new Date(fechaISO);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

// ─── Buscador inline (no usa prop "icon" del Input, construido ad-hoc) ───────

function SearchInput({ value, onChange }) {
  return (
    <div className="relative w-full sm:max-w-md">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A8AA] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Buscar por número de orden..."
        className="w-full rounded-[6px] border border-[#3a3a3a] bg-transparent py-2.5 pl-9 pr-3 text-sm text-white placeholder-[#A8A8AA] transition-colors hover:border-[#555] focus:border-[#F78736] focus:outline-none focus:ring-2 focus:ring-[#F78736]"
      />
    </div>
  );
}

// ─── Columnas de la tabla ─────────────────────────────────────────────────────

const TABLE_COLUMNS = [
  { key: "id", label: "N.º Transacción", className: "font-mono text-xs text-white" },
  { key: "usuario", label: "Usuario", className: "text-white" },
  { key: "rol", label: "Rol", className: "text-[#A8A8AA]" },
  {
    key: "monto",
    label: "Monto",
    className: "text-white font-semibold",
    render: (item) => `$${item.monto.toLocaleString("es-AR")}`,
  },
  { key: "metodo", label: "Método", className: "text-[#A8A8AA]" },
  {
    key: "fecha",
    label: "Fecha",
    className: "text-[#A8A8AA]",
    render: (item) => formatFecha(item.fecha),
  },
  {
    key: "estado",
    label: "Estado",
    render: (item) => (
      <Badge variant={getStatusVariant(item.estado)}>{item.estado}</Badge>
    ),
  },
  {
    key: "acciones",
    label: "Acciones",
    headerClassName: "text-right",
    className: "text-right",
    render: () => (
      <div className="flex items-center justify-end gap-2">
        {/* CA04 — Botones presentes pero siempre disabled en esta iteración */}
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="gap-1.5 border-[#3a3a3a] text-xs"
        >
          <ArrowPathIcon className="h-3.5 w-3.5" />
          Realizar reembolso
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="gap-1.5 border-[#3a3a3a] text-xs"
        >
          <XCircleIcon className="h-3.5 w-3.5" />
          Cancelar transacción
        </Button>
      </div>
    ),
  },
];

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // CA02 — Filtrado dinámico por número de transacción
  const filteredTransactions = mockTransactions.filter((trx) =>
    trx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determinar el empty state correcto (CA02 / CA05)
  const emptyTitle =
    searchTerm.length > 0
      ? "No se encontraron resultados"
      : "No hay transacciones registradas";
  const emptyDescription =
    searchTerm.length > 0
      ? `No hay transacciones que coincidan con "${searchTerm}".`
      : "Cuando se realicen transacciones, aparecerán en este listado.";

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb — CA01 */}
      <Breadcrumbs
        items={[
          { label: "General", href: ROUTES.ADMIN_DASHBOARD },
          { label: "Transacciones" },
        ]}
      />

      {/* Título y descripción — CA01 */}
      <div>
        <h1 className="text-3xl font-bold text-white">Transacciones</h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">
          Consultá el historial de transacciones realizadas en la plataforma.
        </p>
      </div>

      {/* Tab visual único — "Todas las transacciones" */}
      <div className="flex gap-6 border-b border-[#323232]">
        <button className="flex items-center gap-2 border-b-2 border-[#F78736] pb-3 text-sm font-medium text-white transition-colors">
          <CreditCardIcon className="h-4 w-4" />
          Todas las transacciones
        </button>
      </div>

      {/* Buscador + Contador — CA02 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <p className="shrink-0 text-sm text-[#A8A8AA]">
          Mostrando {filteredTransactions.length} de {mockTransactions.length} transacciones
        </p>
      </div>

      {/* Tabla con estado vacío y de carga — CA03, CA04, CA05 */}
      <div className="overflow-hidden rounded-[6px] border border-[#323232] bg-[#292929]">
        <DataTable
          columns={TABLE_COLUMNS}
          data={filteredTransactions}
          emptyState={
            <EmptyState
              icon={CreditCardIcon}
              title={emptyTitle}
              description={emptyDescription}
            />
          }
        />
      </div>
    </div>
  );
}
