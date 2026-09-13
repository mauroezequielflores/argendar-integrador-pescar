import React from "react";
import { CHATBOT_EXAMPLES } from "../data/helpData";

export default function ChatbotHelpCard({ onOpenChatbot, onScrollToFaq }) {
  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
      {/* Icono Bot estilo Argendar */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F78736] text-white shadow-md">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="10" rx="2" fill="#202020" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
          <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
        </svg>
      </div>

      {/* Encabezado */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-white">
          ¿Necesitás ayuda inmediata?
        </h3>
        <p className="mt-1 text-xs text-[#A8A8AA] leading-relaxed">
          Nuestro asistente inteligente está disponible 24/7 para resolver dudas rápidas.
        </p>
      </div>

      {/* Ejemplos */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A8A8AA]">
          EJEMPLOS:
        </span>
        {CHATBOT_EXAMPLES.map((example, idx) => (
          <button
            key={idx}
            type="button"
            onClick={onOpenChatbot}
            className="w-full rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2 text-left text-xs text-[#A8A8AA] transition-colors hover:border-[#555] hover:text-white cursor-pointer"
          >
            {example}
          </button>
        ))}
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={onOpenChatbot}
          className="w-full rounded-[6px] bg-[#F78736] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#e5782c] cursor-pointer"
        >
          Abrir Chatbot
        </button>
        <button
          type="button"
          onClick={onScrollToFaq}
          className="w-full rounded-[6px] border border-[#323232] bg-transparent py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#323232] cursor-pointer"
        >
          Ver preguntas frecuentes
        </button>
      </div>
    </div>
  );
}
