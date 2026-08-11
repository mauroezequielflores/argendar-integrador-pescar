/**
 * PageHeader — Encabezado de sección con título y acciones opcionales.
 */
export default function PageHeader({ title, subtitle, actions, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-[32px] font-bold leading-tight text-white">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-xs text-[#A8A8AA]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
