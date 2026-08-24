import { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export const Input = forwardRef(({ label, type = 'text', error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-[#FFFFFF] text-sm font-medium">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={`w-full bg-[#292929] text-[#FFFFFF] placeholder-[#A8A8AA] rounded-md px-4 py-2 border focus:outline-none focus:ring-1 focus:ring-[#F78736] transition-colors
            ${error ? 'border-red-500' : 'border-[#A8A8AA] focus:border-[#F78736]'}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A8AA] hover:text-[#FFFFFF]"
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
});

Input.displayName = 'Input';
