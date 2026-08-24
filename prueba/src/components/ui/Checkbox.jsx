import { forwardRef } from 'react';

export const Checkbox = forwardRef(({ label, ...props }, ref) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className="peer appearance-none w-4 h-4 border border-[#A8A8AA] rounded bg-transparent checked:bg-[#F78736] checked:border-[#F78736] cursor-pointer"
          {...props}
        />
        <svg
          className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block left-[2px] top-[2px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      {label && <span className="text-[#A8A8AA] text-sm group-hover:text-white transition-colors">{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
