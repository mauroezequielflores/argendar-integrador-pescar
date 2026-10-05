import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../services/transactionsService";
import { mapTransaction, getTransactionsErrorMessage } from "../utils/transactionsMappers";
import { transactionsKeys } from "../constants/transactions.queryKeys";

export const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

export function useTransactionsData() {
  const [searchTerm, setSearchTermState] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setAppliedSearch(searchTerm), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = { search: appliedSearch, page, limit: PAGE_SIZE };

  const { data, isLoading, isError, error: queryError, refetch } = useQuery({
    queryKey: transactionsKeys.list(queryParams),
    queryFn: () => fetchTransactions(queryParams),
    staleTime: 1000 * 60 * 5,
  });

  const transactions = data?.items?.map(mapTransaction) || [];
  const totalCount = data?.meta?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const error = isError ? getTransactionsErrorMessage(queryError) : null;

  const setSearchTerm = useCallback((term) => {
    setSearchTermState(term);
    setPage(1);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    transactions,
    totalCount,
    page,
    totalPages,
    setPage,
    isLoading,
    error,
    refetch,
  };
}
