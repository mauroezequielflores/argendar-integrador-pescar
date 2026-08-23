import { useState } from "react";

/**
 * ToggleSwitch — Interruptor on/off estilo iOS adaptado al tema oscuro.
 *
 * @param {boolean} initialEnabled - Estado inicial.
 * @param {function} onChange - Callback al cambiar estado.
 */
export default function ToggleSwitch({ initialEnabled = false, onChange }) {
  const [enabled, setEnabled] = useState(initialEnabled);

  const toggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    if (onChange) onChange(newState);
  };

  return (
    <button
      type="button"
      className={`${
        enabled ? "bg-[#F78736]" : "bg-[#3a3a3a]"
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
      onClick={toggle}
      role="switch"
      aria-checked={enabled}
    >
      <span className="sr-only">Alternar configuración</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? "translate-x-5" : "translate-x-0"
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
}
