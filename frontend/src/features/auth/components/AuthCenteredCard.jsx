/**
 * AuthCenteredCard — Contenedor centrado para flujos de autenticación / recuperación.
 *
 * Fondo de pantalla: #292929
 * Fondo de tarjeta: #202020
 */
export default function AuthCenteredCard({ children, className = "" }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#292929] px-4 py-8">
      <div
        className={`w-full max-w-[440px] rounded-[16px] bg-[#202020] p-6 sm:p-9 shadow-2xl border border-white/5 transition-all duration-200 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}