import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { moderationService } from "../services/moderationService";
import { mapModerationItem, getModerationErrorMessage } from "../utils/moderationMappers";
import { moderationKeys } from "../constants/moderation.queryKeys";

export const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

export function useModerationPanel(panel) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQueryState] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setAppliedSearch(searchQuery), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const queryParams = { search: appliedSearch, page, limit: PAGE_SIZE };

  const { data, isLoading, isError, error: queryError, refetch } = useQuery({
    queryKey: moderationKeys.list(panel, queryParams),
    queryFn: () => moderationService.list(panel, queryParams),
    staleTime: 1000 * 60 * 5,
  });

  const items = data?.items?.map(mapModerationItem) || [];
  const totalCount = data?.meta?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const error = isError ? getModerationErrorMessage(queryError, "No se pudieron cargar los datos.") : null;

  const setSearchQuery = useCallback((query) => {
    setSearchQueryState(query);
    setPage(1);
  }, []);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => moderationService.updateStatus(panel, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.lists() });
    }
  });

  const activateItem = useCallback(
    (id) => statusMutation.mutate({ id, status: "active" }),
    [statusMutation]
  );
  
  const disableItem = useCallback(
    (id) => statusMutation.mutate({ id, status: "disabled" }),
    [statusMutation]
  );
  
  const deleteItem = useCallback(
    (id) => statusMutation.mutate({ id, status: "deleted" }),
    [statusMutation]
  );

  const actionError = statusMutation.error ? getModerationErrorMessage(statusMutation.error, "No se pudo actualizar el elemento.") : null;

  return {
    items,
    totalCount,
    page,
    totalPages,
    setPage,
    isLoading: isLoading || statusMutation.isPending,
    error,
    actionError,
    searchQuery,
    setSearchQuery,
    activateItem,
    disableItem,
    deleteItem,
    refetch,
  };
}
