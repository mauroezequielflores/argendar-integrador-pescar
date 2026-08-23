import axios from "axios";

/**
 * Instancia de Axios configurada para Argendar.
 *
 * NOTA: baseURL vacía intencionalmente.
 * Configurar cuando el backend esté disponible.
 *
 * Interceptors de request/response listos para
 * agregar Authorization headers y manejar errores globales.
 */
export const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de request — agregar token cuando exista backend
api.interceptors.request.use(
  (config) => {
    // const token = getToken(); // implementar cuando haya auth real
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response — manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar 401, 403, 500, etc. de forma centralizada
    return Promise.reject(error);
  }
);
