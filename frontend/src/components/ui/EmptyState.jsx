/**
 * EmptyState — Pantalla vacía o estado sin contenido.
 */
export default function EmptyState({
  icon: Icon,
  title = "Sin contenido",
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 text-center ${className}`}
      role="status"
    >
      {Icon && (
        <div className="rounded-full bg-[#2e2e2e] p-4">
          <Icon className="h-8 w-8 text-[#A8A8AA]" />
        </div>
      )}
      <p className="text-base font-semibold text-white">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-[#A8A8AA]">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
