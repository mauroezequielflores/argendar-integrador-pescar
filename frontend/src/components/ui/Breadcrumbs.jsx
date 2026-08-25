import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

/**
 * Breadcrumbs — Rastro de navegación.
 *
 * @param {Array} items - Array de objetos { label, href }.
 * @param {string|ReactNode} separator - Separador entre items ("/" o "chevron" o nodo personalizado). Por defecto "/".
 * @param {string} className - Clases adicionales para el contenedor.
 */
export default function Breadcrumbs({ items = [], separator = "/", className = "" }) {
  return (
    <nav aria-label="Navegación Breadcrumb" className={`flex items-center text-xs text-[#A8A8AA] ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center">
            {isLast ? (
              <span className="font-semibold text-white" aria-current="page">
                {item.label}
              </span>
            ) : (
              <>
                {item.href ? (
                  <Link
                    to={item.href}
                    className="cursor-pointer text-[#A8A8AA] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#A8A8AA]">{item.label}</span>
                )}
                {separator === "chevron" ? (
                  <ChevronRightIcon className="mx-2 h-3 w-3 text-[#A8A8AA]" />
                ) : (
                  <span className="mx-2 text-[#A8A8AA]">{separator}</span>
                )}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
