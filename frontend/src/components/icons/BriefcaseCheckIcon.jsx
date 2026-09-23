/**
 * BriefcaseCheckIcon — Maletín con tilde de verificación.
 * Ícono personalizado para la notificación "Trabajo Finalizado".
 * Acepta las mismas props que los íconos de @heroicons/react.
 */
export default function BriefcaseCheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Maletín */}
      <path
        fillRule="evenodd"
        d="M7 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1h1a3 3 0 0 1 3 3v2.382a13.065 13.065 0 0 1-5.586 1.27A13.065 13.065 0 0 1 10 11.38V11h4a.75.75 0 0 0 0-1.5H10V9a.75.75 0 0 0-1.5 0v.382A13.065 13.065 0 0 1 3 8.382V9h-.5A.75.75 0 0 0 2 9.75V10a.75.75 0 0 0 .5.707V16a3 3 0 0 0 3 3h8.197A4.5 4.5 0 0 1 9.5 19H6a3 3 0 0 1-3-3V9.75A.75.75 0 0 0 2.5 9H2V8a3 3 0 0 1 3-3h1V5Zm1.5 0a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1h-7V5Z"
        clipRule="evenodd"
      />
      {/* Tilde de verificación — círculo inferior derecho */}
      <path
        fillRule="evenodd"
        d="M19.5 15a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0Zm-1.97-1.03a.75.75 0 0 0-1.06 0l-1.22 1.22-.47-.47a.75.75 0 0 0-1.06 1.06l1 1a.75.75 0 0 0 1.06 0l1.75-1.75a.75.75 0 0 0 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
