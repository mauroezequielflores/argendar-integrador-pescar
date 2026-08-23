export default function Avatar({ initials, isVerified, size = "md", className = "" }) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-20 w-20 text-2xl",
  };

  const indicatorSizes = {
    sm: "h-2 w-2 border",
    md: "h-2.5 w-2.5 border-2",
    lg: "h-4 w-4 border-2",
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`flex items-center justify-center rounded-full bg-[#F78736] font-bold text-white ${sizeClasses[size]}`}>
        {initials || "U"}
      </div>
      {isVerified && (
        <div className={`absolute bottom-0 right-0 rounded-full border-[#202020] bg-green-500 ${indicatorSizes[size]}`}></div>
      )}
    </div>
  );
}
