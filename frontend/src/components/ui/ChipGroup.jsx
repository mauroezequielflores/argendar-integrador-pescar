/**
 * ChipGroup — Selector de tags / chips con selección múltiple o simple.
 *
 * @param {object} props
 * @param {string[]} props.options - Lista de etiquetas disponibles
 * @param {string[]} props.selectedValues - Lista de etiquetas seleccionadas actualmente
 * @param {function} props.onToggle - Callback invocado al hacer clic en un chip: (option) => void
 * @param {string} props.className - Clases CSS adicionales para el contenedor
 */
export default function ChipGroup({
  options = [],
  selectedValues = [],
  onToggle,
  className = "",
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-2.5 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);

        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle && onToggle(option)}
            className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150 ${
              isSelected
                ? "border border-[#F78736] bg-[#292929] text-[#F78736] shadow-sm"
                : "border border-[#323232] bg-[#202020] text-[#A8A8AA] hover:border-[#727272] hover:text-white"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
