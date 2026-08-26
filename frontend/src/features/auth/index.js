export { default as LoginPage } from "./pages/LoginPage";
export { default as RegisterPage } from "./pages/RegisterPage";
export { default as RoleSelectionPage } from "./pages/RoleSelectionPage";
export { default as ResetPasswordPage } from "./pages/ResetPasswordPage";
export { default as ResetPasswordConfirmPage } from "./pages/ResetPasswordConfirmPage";

// Exportar componentes reutilizables de autenticación
export { default as AuthCenteredCard } from "./components/AuthCenteredCard";
export { default as AuthHeaderBadge } from "./components/AuthHeaderBadge";
export { default as AuthDivider } from "./components/AuthDivider";
export { default as AuthCard } from "./components/AuthCard";

// Servicios de autenticación preparados para backend
export * from "./services/auth.service";