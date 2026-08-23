import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

/**
 * Breadcrumbs — Rastro de navegación.
 *
 * @param {Array} items - Array de objetos { label, href }.
 */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Navegación Breadcrumb" className="flex items-center text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center">
            {isLast ? (
              <span className="font-medium text-white" aria-current="page">
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  to={item.href || "#"}
                  className="font-medium text-[#A8A8AA] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
                <ChevronRightIcon className="mx-2 h-3 w-3 text-[#A8A8AA]" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
