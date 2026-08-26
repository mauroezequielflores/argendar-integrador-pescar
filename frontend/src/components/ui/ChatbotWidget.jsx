import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon, ClockIcon } from "@heroicons/react/24/outline";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";

import {
  CHATBOT_EXCLUDED_ROUTES,
  CHATBOT_EXCLUDED_PATTERNS,
  getChatbotResponse,
} from "../../constants/chatbotFaq";

// Icono del robot (SVG simplificado basado en el diseño)
const RobotIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
    {/* Antena base */}
    <rect x="57" y="24" width="6" height="10" fill="#F78736" />
    <circle cx="60" cy="20" r="5" fill="#F78736" />
    {/* Cuerpo principal (perspectiva 3D) */}
    <path d="M72 34 L102 38 L98 84 L68 88 Z" fill="#D3691A" />
    <path d="M22 34 L72 34 L68 88 L18 88 Z" fill="#F78736" />
    <path d="M22 34 L72 34 L102 38 L52 38 Z" fill="#FF9D55" />
    {/* Oreja */}
    <rect x="14" y="52" width="6" height="16" rx="3" fill="#F78736" />
    {/* Pantalla */}
    <rect x="28" y="44" width="32" height="24" rx="4" fill="#202020" />
    {/* Ojos */}
    <rect x="34" y="50" width="4" height="12" rx="2" fill="#FFFFFF" />
    <rect x="46" y="50" width="4" height="12" rx="2" fill="#FFFFFF" />
  </svg>
);

export default function ChatbotWidget({ role = "client" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showQuestions, setShowQuestions] = useState(true);
  
  const location = useLocation();
  const chatEndRef = useRef(null);

  // Determinar si el widget debe estar visible
  const isExcluded = () => {
    const { pathname } = location;
    if (CHATBOT_EXCLUDED_ROUTES.includes(pathname)) return true;
    for (const pattern of CHATBOT_EXCLUDED_PATTERNS) {
      if (pattern.test(pathname)) return true;
    }
    return false;
  };

  // Cargar preguntas basadas en la ruta actual
  const currentFaqs = getChatbotResponse(location.pathname, role);

  // Reiniciar estado al cambiar de ruta
  useEffect(() => {
    setMessages([]);
    setShowQuestions(true);
  }, [location.pathname]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showQuestions]);

  if (isExcluded()) {
    return null;
  }

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleQuestionClick = (faq) => {
    setShowQuestions(false);
    setMessages([
      ...messages,
      { type: "user", text: faq.question },
      { type: "bot", text: faq.answer },
    ]);
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#F78736] text-white shadow-lg hover:bg-[#e06d00] transition-colors"
          aria-label="Abrir asistente de IA"
        >
          <ChatBubbleLeftEllipsisIcon className="h-7 w-7" />
        </button>
      )}

      {/* Ventana del Chatbot */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[360px] flex-col overflow-hidden rounded-xl bg-[#292929] shadow-2xl border border-[#323232] sm:right-6 sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#323232] bg-[#292929] px-4 py-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-[#F78736]" />
              <span className="font-semibold text-white">Asistente de IA</span>
            </div>
            <div className="flex gap-3">
              <button className="text-[#A8A8AA] hover:text-white transition-colors">
                <ClockIcon className="h-5 w-5" />
              </button>
              <button onClick={handleClose} className="text-[#A8A8AA] hover:text-white transition-colors">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cuerpo del Chat */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-8 pb-4 text-center">
                <RobotIcon />
                <h3 className="mt-4 text-xl font-bold text-white">
                  Hola, ¿en qué te puedo<br/>ayudar hoy?
                </h3>
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 text-sm ${
                        msg.type === "user"
                          ? "bg-[#323232] text-white rounded-br-none"
                          : "bg-transparent text-white"
                      }`}
                    >
                      {msg.type === "bot" && (
                        <div className="flex items-center gap-2 mb-1">
                          <SparklesIcon className="h-4 w-4 text-[#F78736]" />
                          <span className="font-medium text-[#F78736]">Asistente</span>
                        </div>
                      )}
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Opciones de Preguntas */}
            {showQuestions && currentFaqs.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 items-end">
                {currentFaqs.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuestionClick(faq)}
                    className="rounded-lg border border-[#323232] bg-[#323232] px-4 py-2.5 text-sm text-left text-white hover:bg-[#3f3f3f] transition-colors max-w-[85%]"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            )}

            {/* Botón Ver más preguntas */}
            {!showQuestions && currentFaqs.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowQuestions(true)}
                  className="rounded-full border border-[#727272] px-4 py-1.5 text-sm text-[#A8A8AA] hover:text-white transition-colors"
                >
                  Ver más preguntas
                </button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input bloqueado (MVP) */}
          <div className="border-t border-[#323232] bg-[#292929] p-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tu consulta aquí"
                disabled
                className="w-full rounded-lg border border-[#323232] bg-[#202020] px-4 py-3 pr-12 text-sm text-white placeholder-[#A8A8AA] outline-none opacity-80 cursor-not-allowed"
              />
              <button disabled className="absolute right-3 text-[#A8A8AA] opacity-50 cursor-not-allowed">
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
