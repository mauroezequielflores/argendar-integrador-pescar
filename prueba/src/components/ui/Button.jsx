import { ArrowPathIcon } from '@heroicons/react/24/outline';

export const Button = ({ children, variant = 'primary', isLoading, className = '', ...props }) => {
  const baseStyles = "flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors w-full";
  const variants = {
    primary: "bg-[#F78736] text-white hover:bg-[#e0752f] disabled:bg-opacity-50 disabled:cursor-not-allowed",
    outline: "bg-transparent text-white border border-[#727272] hover:bg-[#333333] disabled:border-opacity-50 disabled:cursor-not-allowed"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" /> : null}
      {children}
    </button>
  );
};
