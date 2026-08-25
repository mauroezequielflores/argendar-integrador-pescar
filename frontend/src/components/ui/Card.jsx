/**
 * Card — Contenedor de superficie elevada.
 *
 * Usa el token de color card (#202020) con borde redondeado según variante.
 */
export default function Card({ children, className = "", rounded = "card" }) {
  const radii = {
    card: "rounded-[16px]",
    sm: "rounded-[6px]",
    md: "rounded-[12px]",
  };

  return (
    <div
      className={`bg-[#292929] ${radii[rounded]} ${className}`}
    >
      {children}
    </div>
  );
}