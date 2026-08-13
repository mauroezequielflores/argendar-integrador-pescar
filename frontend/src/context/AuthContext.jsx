import { createContext, useContext, useState } from "react";
import { ROLES } from "../constants/roles";

/**
 * AuthContext — Contexto de autenticación de Argendar.
 *
 * DEMO: No implementa JWT, localStorage ni backend.
 * El usuario demo representa los diferentes roles de la plataforma.
 * Cambiar el rol del usuario para probar diferentes flujos.
 */

// Usuarios demo por rol — cambiar `currentDemoRole` para simular roles
const DEMO_USERS = {
  [ROLES.CLIENTE]: {
    id: 1,
    name: "Lucía",
    lastName: "González",
    email: "lucia@demo.argendar.com",
    role: ROLES.CLIENTE,
    avatar: null,
  },
  [ROLES.PROFESIONAL]: {
    id: 2,
    name: "Carlos",
    lastName: "Martínez",
    email: "carlos@demo.argendar.com",
    role: ROLES.PROFESIONAL,
    avatar: null,
  },
  [ROLES.ADMINISTRADOR]: {
    id: 3,
    name: "Admin",
    lastName: "Argendar",
    email: "admin@argendar.com",
    role: ROLES.ADMINISTRADOR,
    avatar: null,
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  /**
   * Simula el login. En producción reemplazar con llamada a Supabase/API.
   * Acepta un rol para seleccionar el usuario demo correcto.
   */
  const login = async (role = ROLES.CLIENTE) => {
    setIsLoading(true);
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));
    const demoUser = DEMO_USERS[role] || DEMO_USERS[ROLES.CLIENTE];
    setUser(demoUser);
    setIsLoading(false);
    return demoUser;
  };

  /**
   * Simula el registro. Redirige al rol correcto.
   */
  const register = async (data, role) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser = {
      id: Date.now(),
      name: data.nombre,
      lastName: data.apellido,
      email: data.email,
      role: role,
      avatar: null,
    };
    setUser(newUser);
    setIsLoading(false);
    return newUser;
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

/**
 * Hook para consumir el AuthContext.
 * Usar en cualquier componente que necesite información del usuario.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return context;
}
