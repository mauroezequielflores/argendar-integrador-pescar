/**
 * EmptyState — Pantalla vacía o estado sin contenido.
 *
 * @param {Component} icon - Componente de ícono de Heroicons.
 * @param {string} title - Título destacado.
 * @param {string} description - Texto secundario o explicativo.
 * @param {ReactNode} action - Botón o acción opcional.
 * @param {boolean} isCard - Si es true, envuelve el estado vacío en una tarjeta contenedora con fondo #292929.
 * @param {string} iconContainerClassName - Clases para el contenedor circular del ícono.
 * @param {string} iconClassName - Clases para el ícono.
 * @param {string} titleClassName - Clases para el título.
 * @param {string} descriptionClassName - Clases para la descripción.
 * @param {string} className - Clases adicionales para el contenedor principal.
 */
export default function EmptyState({
  icon: Icon,
  title = "Sin contenido",
  description,
  action,
  isCard = false,
  iconContainerClassName = "",
  iconClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  className = "",
}) {
  const cardStyles = isCard
    ? "rounded-[8px] sm:rounded-[12px] bg-[#292929] min-h-[420px] sm:min-h-[480px] w-full"
    : "";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 px-4 text-center ${cardStyles} ${className}`}
      role="status"
    >
      {Icon && (
        <div
          className={`flex items-center justify-center rounded-full bg-[#323232] p-3.5 mb-1 ${iconContainerClassName}`}
        >
          <Icon className={`h-7 w-7 text-[#A8A8AA] ${iconClassName}`} />
        </div>
      )}
      <p className={`text-base sm:text-lg font-bold text-white ${titleClassName}`}>
        {title}
      </p>
      {description && (
        <p className={`max-w-md text-sm text-[#A8A8AA] ${descriptionClassName}`}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
