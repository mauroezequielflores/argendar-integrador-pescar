/**
 * ServiceCard — card reutilizable para la sección "Servicios disponibles".
 * Muestra un ícono SVG centrado sobre un fondo oscuro y un label debajo.
 *
 * Props:
 *  - icon (string): ruta al SVG importado como módulo
 *  - label (string): nombre del servicio
 */
export default function ServiceCard({ icon, label }) {
  return (
    <li className="flex flex-col items-center gap-5 rounded-2xl border border-zinc-700 bg-[#292929] p-8 transition-all duration-200 hover:scale-105 hover:border-[#F78736]">
      {/* Área de ícono — overflow-hidden para que SVGs con fondo propio llenen la caja */}
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-[#1e1e1e]">
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-contain"
          draggable="false"
        />
      </div>

      {/* Label */}
      <span className="text-sm font-semibold text-white">{label}</span>
    </li>
  );
}
