import { useState, useEffect, useCallback } from "react";
import { moderationService } from "../services/moderationService";
import { MODERATION_STATES } from "../data/mockModerationData";

/**
 * useModerationPanel — Hook reutilizable por cada panel de moderación.
 *
 * Encapsula: carga, error, búsqueda por ID y acciones de estado
 * (activar, desactivar, eliminar) de forma local (sin backend todavía).
 *
 * @param {"solicitudes"|"ofertas"|"calificaciones"|"turnos"} panel
 */
export function useModerationPanel(panel) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data = [];
      switch (panel) {
        case "solicitudes":
          data = await moderationService.getSolicitudes();
          break;
        case "ofertas":
          data = await moderationService.getOfertas();
          break;
        case "calificaciones":
          data = await moderationService.getCalificaciones();
          break;
        case "turnos":
          data = await moderationService.getTurnos();
          break;
        default:
          data = [];
      }
      setItems(data);
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los datos.");
    } finally {
      setIsLoading(false);
    }
  }, [panel]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Filtrado dinámico por ID (número de orden)
  const filteredItems = searchQuery.trim()
    ? items.filter((item) =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // ── Acciones de estado (CA05) ──────────────────────────────
  const activateItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado: MODERATION_STATES.ACTIVE } : item
      )
    );
  };

  const disableItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado: MODERATION_STATES.DISABLED } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado: MODERATION_STATES.DELETED } : item
      )
    );
  };

  return {
    items,
    filteredItems,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    activateItem,
    disableItem,
    deleteItem,
    refetch: fetchItems,
  };
}
