
import { createContext, useContext, useState } from "react";
import { api } from "../libs/axios"; //instancia de Axios 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  /**
   * Login Real con el Backend
   */
  const login = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });

      // Guardamos la info del usuario. Nota: Guardar el token (response.data.session.access_token) 
      // en un localStorage se implementará más adelante.
      setUser(response.data.user);
      setIsLoading(false);
      return response.data.user;
    } catch (error) {
      setIsLoading(false);
      // El backend devuelve { error: { code, message } }
      const errorMessage = error.response?.data?.error?.message || "Ocurrió un error al iniciar sesión";
      throw new Error(errorMessage);
    }
  };

  /**
   * Registro Real con el Backend
   */
  const register = async (data, role) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        role: role
      });

      // El registro es exitoso. Opcionalmente podrías forzar un login automático aquí.
      setUser(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.error?.message || "Ocurrió un error al registrarse";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return context;
}


