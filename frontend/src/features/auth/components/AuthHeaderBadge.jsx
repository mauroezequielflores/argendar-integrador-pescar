/**
 * AuthHeaderBadge — Insignia circular superior para iconos de autenticación.
 */
export default function AuthHeaderBadge({ icon: Icon, children, className = "" }) {
  return (
    <div
      className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#292929] border border-[#3a3a3a] text-white shadow-md ${className}`}
    >
      {Icon ? <Icon className="h-6 w-6 text-white" aria-hidden="true" /> : children}
    </div>
  );
}