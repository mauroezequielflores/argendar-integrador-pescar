import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, updateUserStatus, deleteUser } from "../services/usersService";
import { TAB_ROLES, mapUser, getUsersErrorMessage } from "../utils/usersMappers";
import { usersKeys } from "../constants/users.queryKeys";

export const PAGE_SIZE = 10;
const initialByTab = (value) => ({ profesionales: value, clientes: value, administradores: value });

export function useUsersData() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profesionales");
  const [searchTerms, setSearchTerms] = useState(initialByTab(""));
  const [pages, setPages] = useState(initialByTab(1));

  const searchTerm = searchTerms[activeTab];
  const [appliedSearches, setAppliedSearches] = useState(initialByTab(""));
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearches((prev) => (prev[activeTab] === searchTerm ? prev : { ...prev, [activeTab]: searchTerm }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, activeTab]);

  const appliedSearch = appliedSearches[activeTab];
  const page = pages[activeTab];
  const role = TAB_ROLES[activeTab];

  const queryParams = { role, search: appliedSearch, page, limit: PAGE_SIZE };

  const { data, isLoading, isError, error: queryError, refetch } = useQuery({
    queryKey: usersKeys.list(queryParams),
    queryFn: () => fetchUsers(queryParams),
    staleTime: 1000 * 60 * 5,
  });

  const users = data?.items?.map(mapUser) || [];
  const totalCount = data?.meta?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const error = isError ? getUsersErrorMessage(queryError, "No se pudieron cargar los usuarios.") : null;

  const setSearchTerm = useCallback((panelKey, term) => {
    setSearchTerms((prev) => ({ ...prev, [panelKey]: term }));
    setPages((prev) => ({ ...prev, [panelKey]: 1 }));
  }, []);

  const setPage = useCallback(
    (nextPage) => setPages((prev) => ({ ...prev, [activeTab]: nextPage })),
    [activeTab],
  );

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      }
    }
  });

  const handleSuspend = useCallback(
    (panelKey, id) => statusMutation.mutate({ id, status: "disabled" }),
    [statusMutation]
  );
  
  const handleActivate = useCallback(
    (panelKey, id) => statusMutation.mutate({ id, status: "active" }),
    [statusMutation]
  );

  const handleDelete = useCallback(
    (panelKey, id) => deleteMutation.mutate(id),
    [deleteMutation]
  );

  const actionError = statusMutation.error 
    ? getUsersErrorMessage(statusMutation.error, "No se pudo actualizar el usuario.") 
    : deleteMutation.error 
      ? getUsersErrorMessage(deleteMutation.error, "No se pudo eliminar el usuario.") 
      : null;

  return {
    activeTab,
    setActiveTab,
    searchTerms,
    setSearchTerm,
    users,
    totalCount,
    page,
    totalPages,
    setPage,
    handleSuspend,
    handleActivate,
    handleDelete,
    isLoading: isLoading || statusMutation.isPending || deleteMutation.isPending,
    error: error || actionError,
    refetch,
  };
}
