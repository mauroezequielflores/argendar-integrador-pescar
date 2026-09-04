/**
 * FadeSection — eliminado por impacto negativo en performance.
 * Se conserva el archivo para no romper imports residuales,
 * pero el componente ahora es un <section> transparente sin lógica de scroll.
 */
export default function FadeSection({ id, children, className = "" }) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}
