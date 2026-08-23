import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./libs/queryClient";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./app/router/AppRouter";

/**
 * App — Raíz de la aplicación Argendar.
 *
 * Providers (de exterior a interior):
 *  BrowserRouter → QueryClientProvider → AuthProvider → AppRouter
 */
export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
