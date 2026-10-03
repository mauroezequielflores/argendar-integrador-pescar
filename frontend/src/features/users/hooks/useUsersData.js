import { useState, useMemo, useCallback } from "react";
import { USER_STATES } from "../constants/users.constants";
import {
  mockProfesionales,
  mockClientes,
  mockAdministradores,
} from "../data/mockUsersData";

/**
 * useUsersData — Hook para manejar el estado de usuarios, filtros de búsqueda,
 * conteos dinámicos y mutaciones de estado en la pantalla de administración.
 */
export function useUsersData() {
  const [usersByTab, setUsersByTab] = useState({
    profesionales: mockProfesionales,
    clientes: mockClientes,
    administradores: mockAdministradores,
  });

  const [activeTab, setActiveTab] = useState("profesionales");
  const [searchTerms, setSearchTerms] = useState({
    profesionales: "",
    clientes: "",
    administradores: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actualizar término de búsqueda para un panel específico
  const setSearchTerm = useCallback((panelKey, term) => {
    setSearchTerms((prev) => ({
      ...prev,
      [panelKey]: term,
    }));
  }, []);

  // Lista sin filtrar del panel activo
  const currentTabUsers = usersByTab[activeTab] || [];
  const currentSearchTerm = searchTerms[activeTab] || "";

  // Filtrado dinámico por número de orden / ID (CA04)
  const filteredUsers = useMemo(() => {
    const term = currentSearchTerm.trim().toLowerCase();
    if (!term) return currentTabUsers;
    return currentTabUsers.filter(
      (u) =>
        u.id.toLowerCase().includes(term) ||
        (u.nombre && u.nombre.toLowerCase().includes(term))
    );
  }, [currentTabUsers, currentSearchTerm]);

  // Contador total de usuarios registrados en la plataforma (CA02)
  const totalUsersCount = useMemo(() => {
    return (
      usersByTab.profesionales.filter((u) => u.estado !== USER_STATES.ELIMINADO).length +
      usersByTab.clientes.filter((u) => u.estado !== USER_STATES.ELIMINADO).length +
      usersByTab.administradores.filter((u) => u.estado !== USER_STATES.ELIMINADO).length
    );
  }, [usersByTab]);

  // Cambiar estado a Suspendido (CA06)
  const handleSuspend = useCallback((panelKey, id) => {
    setUsersByTab((prev) => ({
      ...prev,
      [panelKey]: prev[panelKey].map((user) =>
        user.id === id ? { ...user, estado: USER_STATES.SUSPENDIDO } : user
      ),
    }));
  }, []);

  // Cambiar estado a Activo (CA06)
  const handleActivate = useCallback((panelKey, id) => {
    setUsersByTab((prev) => ({
      ...prev,
      [panelKey]: prev[panelKey].map((user) =>
        user.id === id ? { ...user, estado: USER_STATES.ACTIVO } : user
      ),
    }));
  }, []);

  // Cambiar estado a Eliminado (CA06)
  const handleDelete = useCallback((panelKey, id) => {
    setUsersByTab((prev) => ({
      ...prev,
      [panelKey]: prev[panelKey].map((user) =>
        user.id === id ? { ...user, estado: USER_STATES.ELIMINADO } : user
      ),
    }));
  }, []);

  // Función de reintento en caso de simulación de error
  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setUsersByTab({
        profesionales: mockProfesionales,
        clientes: mockClientes,
        administradores: mockAdministradores,
      });
      setIsLoading(false);
    }, 300);
  }, []);

  return {
    usersByTab,
    activeTab,
    setActiveTab,
    searchTerms,
    setSearchTerm,
    currentSearchTerm,
    currentTabUsers,
    filteredUsers,
    totalUsersCount,
    handleSuspend,
    handleActivate,
    handleDelete,
    isLoading,
    error,
    refetch,
  };
}
