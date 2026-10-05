import {
  MagnifyingGlassIcon,
  CreditCardIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import DataTable from "../../../components/ui/DataTable";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import Pagination from "../../../components/ui/Pagination";

import { useTransactionsData } from "../hooks/useTransactionsData";
import { ROUTES } from "../../../constants/routes";

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
  { key: "numero", label: "N.º Transacción", className: "font-mono text-xs text-white" },
  { key: "usuario", label: "Usuario", className: "text-white" },
  { key: "rol", label: "Rol", className: "text-[#A8A8AA]" },
  {
    key: "monto",
    label: "Monto",
    className: "text-white font-semibold",
    render: (item) => `$${item.monto.toLocaleString("es-AR")}`,
  },
  { key: "metodo", label: "Método", className: "text-[#A8A8AA]" },
  { key: "fecha", label: "Fecha", className: "text-[#A8A8AA]" },
  {
    key: "estado",
    label: "Estado",
    render: (item) => <Badge variant={item.estadoVariant}>{item.estado}</Badge>,
  },
  {
    key: "acciones",
    label: "Acciones",
    headerClassName: "text-right",
    className: "text-right",
    render: () => (
      <div className="flex items-center justify-end gap-1.5">
        {/* Botón de Realizar Reembolso (ícono cuadrado compacto) */}
        <button
          type="button"
          disabled
          title="Realizar reembolso"
          aria-label="Realizar reembolso"
          className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#3a3a3a] text-[#A8A8AA] transition-colors hover:border-[#555] hover:text-white bg-transparent opacity-50 cursor-not-allowed"
        >
          <ArrowPathIcon className="h-4 w-4" />
        </button>
      </div>
    ),
  },
];

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AdminTransactionsPage() {
  const {
    searchTerm,
    setSearchTerm,
    transactions,
    totalCount,
    page,
    totalPages,
    setPage,
    isLoading,
    error,
    refetch,
  } = useTransactionsData();

  // Determinar el empty state correcto (CA02 / CA05)
  const hasSearch = searchTerm.trim().length > 0;
  const emptyTitle = hasSearch
    ? "No se encontraron resultados"
    : "No hay transacciones registradas";
  const emptyDescription = hasSearch
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
        <h1 className="text-2xl font-bold text-white">Transacciones</h1>
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

      {/* Manejo de error con reintento */}
      {error && (
        <div
          role="alert"
          className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-[6px] border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={refetch}
            className="flex items-center gap-2 rounded-[6px] bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/30 cursor-pointer"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Reintentar
          </button>
        </div>
      )}

      {/* Buscador + Contador — CA02 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <p className="shrink-0 text-sm text-[#A8A8AA]">
          Mostrando {isLoading ? "…" : transactions.length} de {isLoading ? "…" : totalCount} transacciones
        </p>
      </div>

      {/* Tabla con estado vacío y de carga — CA03, CA04, CA05 */}
      <div className="overflow-hidden rounded-[6px] border border-[#323232] bg-[#292929]">
        <DataTable
          columns={TABLE_COLUMNS}
          data={transactions}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              icon={CreditCardIcon}
              title={emptyTitle}
              description={emptyDescription}
            />
          }
        />
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
