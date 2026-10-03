import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ImagePreviewModal({ isOpen, onClose, imageUrl }) {
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

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-opacity">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-[#292929] p-2 text-[#A8A8AA] hover:bg-[#3f3f3f] hover:text-white transition-colors"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      
      <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt="Vista ampliada"
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>
    </div>
  );
}
