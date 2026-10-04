import { useState, useEffect, useCallback } from "react";
import { USER_STATES } from "../constants/users.constants";
import { fetchUsers, updateUserStatus, deleteUser } from "../services/usersService";
import { TAB_ROLES, mapUser, getUsersErrorMessage } from "../utils/usersMappers";

export const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const initialByTab = (value) => ({ profesionales: value, clientes: value, administradores: value });

/**
 * useUsersData — Hook de la pantalla de usuarios: carga paginada por rol desde el backend,
 * búsqueda con espera (debounce) y acciones de bloqueo / eliminación.
 */
export function useUsersData() {
  const [activeTab, setActiveTab] = useState("profesionales");
  const [searchTerms, setSearchTerms] = useState(initialByTab(""));
  const [appliedSearches, setAppliedSearches] = useState(initialByTab(""));
  const [pages, setPages] = useState(initialByTab(1));
  const [reloadToken, setReloadToken] = useState(0);
  const [actionError, setActionError] = useState(null);
  const [result, setResult] = useState({ key: null, users: [], totalCount: 0, error: null });

  const searchTerm = searchTerms[activeTab];
  const appliedSearch = appliedSearches[activeTab];
  const page = pages[activeTab];

  // La búsqueda se aplica recién cuando el usuario deja de escribir.
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearches((prev) => (prev[activeTab] === searchTerm ? prev : { ...prev, [activeTab]: searchTerm }));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchTerm, activeTab]);

  // Identifica la consulta actual: mientras result.key no coincida, la pantalla está cargando.
  const requestKey = `${activeTab}|${appliedSearch}|${page}|${reloadToken}`;

  useEffect(() => {
    let ignore = false;
    fetchUsers({ role: TAB_ROLES[activeTab], search: appliedSearch, page, limit: PAGE_SIZE })
      .then((data) => {
        if (ignore) return;
        setResult({ key: requestKey, users: data.items.map(mapUser), totalCount: data.meta.totalCount, error: null });
      })
      .catch((err) => {
        if (ignore) return;
        setResult({
          key: requestKey,
          users: [],
          totalCount: 0,
          error: getUsersErrorMessage(err, "No se pudieron cargar los usuarios."),
        });
      });
    return () => {
      ignore = true;
    };
  }, [activeTab, appliedSearch, page, requestKey]);

  const isLoading = result.key !== requestKey;
  const totalPages = Math.max(1, Math.ceil(result.totalCount / PAGE_SIZE));

  const setSearchTerm = useCallback((panelKey, term) => {
    setSearchTerms((prev) => ({ ...prev, [panelKey]: term }));
    setPages((prev) => ({ ...prev, [panelKey]: 1 }));
  }, []);

  const setPage = useCallback(
    (nextPage) => setPages((prev) => ({ ...prev, [activeTab]: nextPage })),
    [activeTab],
  );

  const refetch = useCallback(() => {
    setActionError(null);
    setReloadToken((token) => token + 1);
  }, []);

  // Cambia el estado de una fila solo después de que el backend confirma.
  const changeStatus = useCallback(async (id, status, estado) => {
    setActionError(null);
    try {
      await updateUserStatus(id, status);
      setResult((prev) => ({
        ...prev,
        users: prev.users.map((user) => (user.id === id ? { ...user, estado } : user)),
      }));
    } catch (err) {
      setActionError(getUsersErrorMessage(err, "No se pudo actualizar el usuario."));
    }
  }, []);

  const handleSuspend = useCallback((panelKey, id) => changeStatus(id, "disabled", USER_STATES.SUSPENDIDO), [changeStatus]);
  const handleActivate = useCallback((panelKey, id) => changeStatus(id, "active", USER_STATES.ACTIVO), [changeStatus]);

  const handleDelete = useCallback(
    async (panelKey, id) => {
      setActionError(null);
      try {
        await deleteUser(id);
        // Si era el único de la última página, se retrocede una; si no, se recarga la actual.
        if (result.users.length === 1 && page > 1) setPage(page - 1);
        else setReloadToken((token) => token + 1);
      } catch (err) {
        setActionError(getUsersErrorMessage(err, "No se pudo eliminar el usuario."));
      }
    },
    [result.users.length, page, setPage],
  );

  return {
    activeTab,
    setActiveTab,
    searchTerms,
    setSearchTerm,
    users: result.users,
    totalCount: result.totalCount,
    page,
    totalPages,
    setPage,
    handleSuspend,
    handleActivate,
    handleDelete,
    isLoading,
    error: result.error || actionError,
    refetch,
  };
}
