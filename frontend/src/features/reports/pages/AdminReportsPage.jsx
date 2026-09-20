import React from "react";
import { InboxIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import SearchInput from "../../../components/ui/SearchInput";
import InquiriesTable from "../components/InquiriesTable";
import InquiryDetailModal from "../components/InquiryDetailModal";
import InquiriesEmptyState from "../components/InquiriesEmptyState";
import { useReportsData } from "../hooks/useReportsData";
import { ROUTES } from "../../../constants/routes";

/**
 * AdminReportsPage — Pantalla principal de Bandeja de Consultas para el Administrador.
 * Ruta: /admin/reports (alias /admin/inbox)
 *
 * Criterios de Aceptación:
 * - CA01: Acceso a Consultas, breadcrumbs "General / Consultas", título "Bandeja de consultas".
 * - CA02: Listado de consultas en tabla con FECHA, USUARIO, ROL, ASUNTO, ESTADO y buscador dinámico.
 * - CA03: Detalle de una consulta con datos del remitente, asunto y mensaje original.
 * - CA04: Formulario de respuesta con validación obligatoria y cambio de estado a Respondida.
 * - CA05: Estados de carga, ausencia de información y manejo de error con reintento.
 */
export default function AdminReportsPage() {
  const {
    inquiries,
    filteredInquiries,
    searchTerm,
    setSearchTerm,
    selectedInquiry,
    setSelectedInquiry,
    handleSendReply,
    isLoading,
    error,
    refetch,
  } = useReportsData();

  const breadcrumbItems = [
    { label: "General", href: ROUTES.ADMIN_DASHBOARD },
    { label: "Consultas" },
  ];

  const hasSearch = searchTerm.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Breadcrumbs (CA01) ── */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* ── Encabezado Principal (CA01) ── */}
      <div>
        <h1 className="text-[32px] font-bold leading-tight text-white">
          Bandeja de consultas
        </h1>
        <p className="mt-1 text-sm text-[#A8A8AA]">
          Visualizá y gestioná las consultas enviadas por clientes y profesionales desde la sección de ayuda.
        </p>
      </div>

      {/* ── Tab Visual Superior (Captura de Referencia) ── */}
      <div className="flex items-center gap-6 border-b border-[#323232]">
        <button
          type="button"
          className="flex items-center gap-2 border-b-2 border-[#F78736] pb-3 pt-1 text-sm font-semibold text-white transition-colors cursor-pointer"
        >
          <InboxIcon className="h-4 w-4 text-[#F78736]" />
          <span>Todas las consultas</span>
        </button>
      </div>

      {/* ── Manejo de Error (CA05) ── */}
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

      {/* ── Barra de Búsqueda + Contador Dinámico (CA02) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por número de orden..."
          />
        </div>
        <p className="shrink-0 text-sm text-[#A8A8AA]">
          Mostrando {filteredInquiries.length} de {inquiries.length} solicitudes
        </p>
      </div>

      {/* ── Estado de Carga o Contenido (CA02, CA05) ── */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F78736] border-t-transparent" />
        </div>
      ) : filteredInquiries.length > 0 ? (
        <InquiriesTable
          inquiries={filteredInquiries}
          onSelectInquiry={(inquiry) => setSelectedInquiry(inquiry)}
        />
      ) : (
        <InquiriesEmptyState
          title={hasSearch ? "No se encontraron resultados" : "No hay consultas registradas"}
          description={
            hasSearch
              ? `No encontramos consultas que coincidan con "${searchTerm}".`
              : "Cuando los usuarios envíen consultas desde la sección de ayuda, aparecerán aquí."
          }
        />
      )}

      {/* ── Modal de Detalle y Respuesta (CA03, CA04) ── */}
      <InquiryDetailModal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        inquiry={selectedInquiry}
        onSendReply={handleSendReply}
      />
    </div>
  );
}
