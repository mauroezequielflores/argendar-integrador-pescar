import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchInquiries, fetchInquiry, replyInquiry } from "../services/reportsService";
import { mapInquiry, getReportsErrorMessage } from "../utils/reportsMappers";
import { reportsKeys } from "../constants/reports.queryKeys";

export const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

export function useReportsData() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTermState] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAppliedSearch(searchTerm), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = { search: appliedSearch, page, limit: PAGE_SIZE };

  const { data, isLoading, isError, error: queryError, refetch } = useQuery({
    queryKey: reportsKeys.list(queryParams),
    queryFn: () => fetchInquiries(queryParams),
    staleTime: 1000 * 60 * 5,
  });

  const inquiries = data?.items?.map(mapInquiry) || [];
  const totalCount = data?.meta?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const error = isError ? getReportsErrorMessage(queryError, "No se pudieron cargar las consultas.") : null;

  const setSearchTerm = useCallback((term) => {
    setSearchTermState(term);
    setPage(1);
  }, []);

  const openInquiry = useCallback(async (inquiry) => {
    setActionError(null);
    try {
      const detail = await queryClient.fetchQuery({
        queryKey: reportsKeys.detail(inquiry.id),
        queryFn: () => fetchInquiry(inquiry.id),
        staleTime: 1000 * 60 * 5,
      });
      setSelectedInquiry(mapInquiry(detail));
    } catch (err) {
      setActionError(getReportsErrorMessage(err, "No se pudo abrir la consulta."));
    }
  }, [queryClient]);

  const closeInquiry = useCallback(() => {
    setSelectedInquiry(null);
    setActionError(null);
  }, []);

  const replyMutation = useMutation({
    mutationFn: ({ id, data }) => replyInquiry(id, data),
    onSuccess: (detail) => {
      setSelectedInquiry(mapInquiry(detail));
      queryClient.invalidateQueries({ queryKey: reportsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportsKeys.detail(detail.id) });
    }
  });

  const handleSendReply = useCallback(async (inquiryId, replyData) => {
    try {
      await replyMutation.mutateAsync({ id: inquiryId, data: { subject: replyData.asunto, message: replyData.mensaje } });
    } catch (err) {
      throw new Error(getReportsErrorMessage(err, "No se pudo enviar la respuesta."), { cause: err });
    }
  }, [replyMutation]);

  return {
    inquiries,
    totalCount,
    page,
    totalPages,
    setPage,
    searchTerm,
    setSearchTerm,
    selectedInquiry,
    openInquiry,
    closeInquiry,
    handleSendReply,
    isLoading: isLoading || replyMutation.isPending,
    error: error || actionError,
    refetch,
  };
}
