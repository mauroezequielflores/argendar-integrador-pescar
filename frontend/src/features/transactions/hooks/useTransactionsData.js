import { useState, useEffect, useCallback } from "react";
import { fetchTransactions } from "../services/transactionsService";
import { mapTransaction, getTransactionsErrorMessage } from "../utils/transactionsMappers";

export const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

/**
 * useTransactionsData — Carga paginada de transacciones desde el backend,
 * con búsqueda con espera (debounce) y reintento.
 */
export function useTransactionsData() {
  const [searchTerm, setSearchTermState] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);
  const [result, setResult] = useState({ key: null, transactions: [], totalCount: 0, error: null });

  // La búsqueda se aplica recién cuando el usuario deja de escribir.
  useEffect(() => {
    const timer = setTimeout(() => setAppliedSearch(searchTerm), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Identifica la consulta actual: mientras result.key no coincida, la pantalla está cargando.
  const requestKey = `${appliedSearch}|${page}|${reloadToken}`;

  useEffect(() => {
    let ignore = false;
    fetchTransactions({ search: appliedSearch, page, limit: PAGE_SIZE })
      .then((data) => {
        if (ignore) return;
        setResult({
          key: requestKey,
          transactions: data.items.map(mapTransaction),
          totalCount: data.meta.totalCount,
          error: null,
        });
      })
      .catch((err) => {
        if (ignore) return;
        setResult({ key: requestKey, transactions: [], totalCount: 0, error: getTransactionsErrorMessage(err) });
      });
    return () => {
      ignore = true;
    };
  }, [appliedSearch, page, requestKey]);

  const setSearchTerm = useCallback((term) => {
    setSearchTermState(term);
    setPage(1);
  }, []);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  return {
    searchTerm,
    setSearchTerm,
    transactions: result.transactions,
    totalCount: result.totalCount,
    page,
    totalPages: Math.max(1, Math.ceil(result.totalCount / PAGE_SIZE)),
    setPage,
    isLoading: result.key !== requestKey,
    error: result.error,
    refetch,
  };
}
