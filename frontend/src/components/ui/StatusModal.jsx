import React, { useEffect } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function StatusModal({ 
  isOpen, 
  onClose, 
  type = "success", 
  title, 
  description, 
  buttonText = "Volver a Mi agenda" 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 transition-opacity">
      {/* Modal Container */}
      <div className="w-full max-w-sm rounded-[12px] bg-[#222222] border border-[#333333] p-6 text-center shadow-2xl flex flex-col items-center">
        
        {/* Icon */}
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full shrink-0 ${isSuccess ? "bg-white" : "bg-red-500"}`}>
          {isSuccess ? (
            <CheckIcon className="h-6 w-6 text-black stroke-[3]" />
          ) : (
            <XMarkIcon className="h-6 w-6 text-white stroke-[3]" />
          )}
        </div>
        
        {/* Texts */}
        <h3 className="mb-2 text-[17px] font-bold text-white leading-snug">
          {title}
        </h3>
        
        {description && (
          <p className="mb-6 text-[13px] text-[#A8A8AA] leading-relaxed">
            {description}
          </p>
        )}
        
        {/* Button */}
        <button
          onClick={onClose}
          className="w-full rounded-[6px] bg-[#F78736] py-3 text-sm font-semibold text-white hover:bg-[#e0752b] transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
