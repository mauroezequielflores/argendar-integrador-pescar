import { useState, useEffect, useCallback } from "react";
import { moderationService } from "../services/moderationService";
import { MODERATION_STATES } from "../constants/moderation.constants";
import { mapModerationItem, getModerationErrorMessage } from "../utils/moderationMappers";

export const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

/**
 * useModerationPanel — Hook reutilizable por cada panel de moderación.
 *
 * Carga paginada desde el backend, búsqueda por número de orden con espera (debounce)
 * y acciones de estado (activar, desactivar, eliminar) que se aplican tras la confirmación del servidor.
 *
 * @param {"solicitudes"|"ofertas"|"calificaciones"|"turnos"} panel
 */
export function useModerationPanel(panel) {
  const [searchQuery, setSearchQueryState] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);
  const [actionError, setActionError] = useState(null);
  const [result, setResult] = useState({ key: null, items: [], totalCount: 0, error: null });

  // La búsqueda se aplica recién cuando el usuario deja de escribir.
  useEffect(() => {
    const timer = setTimeout(() => setAppliedSearch(searchQuery), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Identifica la consulta actual: mientras result.key no coincida, el panel está cargando.
  const requestKey = `${panel}|${appliedSearch}|${page}|${reloadToken}`;

  useEffect(() => {
    let ignore = false;
    moderationService
      .list(panel, { search: appliedSearch, page, limit: PAGE_SIZE })
      .then((data) => {
        if (ignore) return;
        setResult({
          key: requestKey,
          items: data.items.map(mapModerationItem),
          totalCount: data.meta.totalCount,
          error: null,
        });
      })
      .catch((err) => {
        if (ignore) return;
        setResult({
          key: requestKey,
          items: [],
          totalCount: 0,
          error: getModerationErrorMessage(err, "No se pudieron cargar los datos."),
        });
      });
    return () => {
      ignore = true;
    };
  }, [panel, appliedSearch, page, requestKey]);

  const setSearchQuery = useCallback((query) => {
    setSearchQueryState(query);
    setPage(1);
  }, []);

  const refetch = useCallback(() => {
    setActionError(null);
    setReloadToken((token) => token + 1);
  }, []);

  // Cambia el estado de una tarjeta solo después de que el backend confirma.
  const changeStatus = useCallback(
    async (id, moderationStatus, estado) => {
      setActionError(null);
      try {
        await moderationService.updateStatus(panel, id, moderationStatus);
        setResult((prev) => ({
          ...prev,
          items: prev.items.map((item) => (item.id === id ? { ...item, estado } : item)),
        }));
      } catch (err) {
        setActionError(getModerationErrorMessage(err, "No se pudo actualizar el elemento."));
      }
    },
    [panel],
  );

  const activateItem = useCallback((id) => changeStatus(id, "active", MODERATION_STATES.ACTIVE), [changeStatus]);
  const disableItem = useCallback((id) => changeStatus(id, "disabled", MODERATION_STATES.DISABLED), [changeStatus]);
  const deleteItem = useCallback((id) => changeStatus(id, "deleted", MODERATION_STATES.DELETED), [changeStatus]);

  return {
    items: result.items,
    totalCount: result.totalCount,
    page,
    totalPages: Math.max(1, Math.ceil(result.totalCount / PAGE_SIZE)),
    setPage,
    isLoading: result.key !== requestKey,
    error: result.error,
    actionError,
    searchQuery,
    setSearchQuery,
    activateItem,
    disableItem,
    deleteItem,
    refetch,
  };
}
