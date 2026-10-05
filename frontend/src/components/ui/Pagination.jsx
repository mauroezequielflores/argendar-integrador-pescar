import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const MAX_VISIBLE_PAGES = 5;

/** Páginas a mostrar: ventana de hasta 5 números alrededor de la actual. */
function getVisiblePages(page, totalPages) {
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  const start = Math.max(1, Math.min(page - half, totalPages - MAX_VISIBLE_PAGES + 1));
  const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const baseButton =
  "flex h-8 min-w-8 items-center justify-center rounded-[6px] border px-2 text-sm font-semibold transition-colors";

/**
 * Pagination — Paginador simple con botones Anterior / Siguiente y números de página.
 * No renderiza nada si hay una sola página.
 *
 * @param {number} props.page - Página actual (empieza en 1).
 * @param {number} props.totalPages - Cantidad total de páginas.
 * @param {function} props.onPageChange - Recibe el número de la página elegida.
 */
export default function Pagination({ page = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginación" className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className={`${baseButton} border-[#3a3a3a] text-[#A8A8AA] hover:bg-[#323232] hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent`}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {getVisiblePages(page, totalPages).map((number) => {
        const isCurrent = number === page;
        return (
          <button
            key={number}
            type="button"
            onClick={() => onPageChange(number)}
            aria-label={`Página ${number}`}
            aria-current={isCurrent ? "page" : undefined}
            className={`${baseButton} cursor-pointer ${
              isCurrent
                ? "border-[#F78736] bg-[#F78736] text-white"
                : "border-[#3a3a3a] text-[#A8A8AA] hover:bg-[#323232] hover:text-white"
            }`}
          >
            {number}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
        className={`${baseButton} border-[#3a3a3a] text-[#A8A8AA] hover:bg-[#323232] hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent`}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </nav>
  );
}
