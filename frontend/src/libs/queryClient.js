import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient de TanStack Query.
 *
 * Configurado con valores por defecto conservadores
 * para una futura integración con backend.
 *
 * NOTA: No se realizan llamadas HTTP en esta etapa.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutos
      gcTime: 1000 * 60 * 10,         // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
