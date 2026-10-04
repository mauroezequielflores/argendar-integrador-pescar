import { useState, useEffect, useCallback } from "react";
import { fetchInquiries, fetchInquiry, replyInquiry } from "../services/reportsService";
import { INQUIRY_STATES } from "../constants/reports.constants";
import { mapInquiry, getReportsErrorMessage } from "../utils/reportsMappers";

export const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

/**
 * useReportsData — Carga paginada de consultas desde el backend, búsqueda con espera (debounce),
 * detalle de una consulta y envío de la respuesta.
 */
export function useReportsData() {
  const [searchTerm, setSearchTermState] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [result, setResult] = useState({ key: null, inquiries: [], totalCount: 0, error: null });

  // La búsqueda se aplica recién cuando el usuario deja de escribir.
  useEffect(() => {
    const timer = setTimeout(() => setAppliedSearch(searchTerm), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Identifica la consulta actual: mientras result.key no coincida, la pantalla está cargando.
  const requestKey = `${appliedSearch}|${page}|${reloadToken}`;

  useEffect(() => {
    let ignore = false;
    fetchInquiries({ search: appliedSearch, page, limit: PAGE_SIZE })
      .then((data) => {
        if (ignore) return;
        setResult({
          key: requestKey,
          inquiries: data.items.map(mapInquiry),
          totalCount: data.meta.totalCount,
          error: null,
        });
      })
      .catch((err) => {
        if (ignore) return;
        setResult({
          key: requestKey,
          inquiries: [],
          totalCount: 0,
          error: getReportsErrorMessage(err, "No se pudieron cargar las consultas."),
        });
      });
    return () => {
      ignore = true;
    };
  }, [appliedSearch, page, requestKey]);

  const setSearchTerm = useCallback((term) => {
    setSearchTermState(term);
    setPage(1);
  }, []);

  const refetch = useCallback(() => {
    setActionError(null);
    setReloadToken((token) => token + 1);
  }, []);

  // Al abrir una consulta se pide el detalle: trae el mensaje completo y el email del usuario.
  const openInquiry = useCallback(async (inquiry) => {
    setActionError(null);
    try {
      setSelectedInquiry(mapInquiry(await fetchInquiry(inquiry.id)));
    } catch (err) {
      setActionError(getReportsErrorMessage(err, "No se pudo abrir la consulta."));
    }
  }, []);

  const closeInquiry = useCallback(() => setSelectedInquiry(null), []);

  // Envía la respuesta. Si falla, lanza el error para que el modal lo muestre sin cerrarse.
  const handleSendReply = useCallback(async (inquiryId, replyData) => {
    try {
      const detail = mapInquiry(
        await replyInquiry(inquiryId, { subject: replyData.asunto, message: replyData.mensaje }),
      );
      setSelectedInquiry(detail);
      setResult((prev) => ({
        ...prev,
        inquiries: prev.inquiries.map((inq) =>
          inq.id === inquiryId ? { ...inq, estado: INQUIRY_STATES.ANSWERED } : inq,
        ),
      }));
    } catch (err) {
      throw new Error(getReportsErrorMessage(err, "No se pudo enviar la respuesta."), { cause: err });
    }
  }, []);

  return {
    inquiries: result.inquiries,
    totalCount: result.totalCount,
    page,
    totalPages: Math.max(1, Math.ceil(result.totalCount / PAGE_SIZE)),
    setPage,
    searchTerm,
    setSearchTerm,
    selectedInquiry,
    openInquiry,
    closeInquiry,
    handleSendReply,
    isLoading: result.key !== requestKey,
    error: result.error || actionError,
    refetch,
  };
}
