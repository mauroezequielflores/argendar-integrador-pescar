import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon, ClockIcon } from "@heroicons/react/24/outline";

import mascotChatbot from "../../assets/brand/mascot-chatbot.svg";
import {
  CHATBOT_EXCLUDED_ROUTES,
  CHATBOT_EXCLUDED_PATTERNS,
  getChatbotResponse,
} from "../../constants/chatbotFaq";

// Icono SVG de Chispas / Asistente para el botón flotante
const SparkleBotIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-7 w-7"
  >
    {/* Estrella grande de 4 puntas */}
    <path
      d="M10 3C10 6.866 6.866 10 3 10C6.866 10 10 13.134 10 17C10 13.134 13.134 10 17 10C13.134 10 10 6.866 10 3Z"
      fill="#F78736"
    />
    {/* Estrella pequeña de 4 puntas */}
    <path
      d="M17 14C17 16.209 15.209 18 13 18C15.209 18 17 19.791 17 22C17 19.791 18.791 18 21 18C18.791 18 17 16.209 17 14Z"
      fill="#F78736"
    />
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

  // Listener para abrir desde otras partes de la app (ej: HelpPage)
  useEffect(() => {
    const handleOpenExternal = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpenExternal);
    return () => window.removeEventListener("open-chatbot", handleOpenExternal);
  }, []);

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
      {/* ── 1. Botón Flotante con Icono SVG ────────────────────────── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#292929] border-2 border-[#3B82F6] text-white shadow-md shadow-[#3B82F6] hover:bg-[#66330E] hover:border-[#F78736] transition-all cursor-pointer"
          aria-label="Abrir asistente de IA"
        >
          <SparkleBotIcon />
        </button>
      )}

      {/* ── 2. Ventana del Chatbot Responsive + Borde Azul 1px (#3B82F6) ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col overflow-hidden rounded-none bg-[#292929] shadow-2xl border-1 border-[#235BB7] md:inset-auto md:bottom-5 md:right-5 md:h-[80vh] md:max-h-[600px] md:w-[360px] md:rounded-[12px] lg:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#3B82F6] bg-[#292929] px-4 py-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-[#F78736]" />
              <span className="font-semibold text-white">Asistente de IA</span>
            </div>
            <div className="flex gap-3">
              <button className="text-[#A8A8AA] hover:text-white transition-colors cursor-pointer">
                <ClockIcon className="h-5 w-5" />
              </button>
              <button onClick={handleClose} className="text-[#A8A8AA] hover:text-white transition-colors cursor-pointer">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cuerpo del Chat */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-8 pb-4 text-center">
                <img
                  src={mascotChatbot}
                  alt="Mascota Chatbot"
                  className="mx-auto mb-4 h-28 w-28 object-contain"
                />
                <h3 className="mt-4 text-xl font-bold text-white">
                  Hola, ¿en qué te puedo<br />ayudar hoy?
                </h3>
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.type === "user"
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
                    className="rounded-lg border border-[#323232] bg-[#323232] px-4 py-2.5 text-sm text-left text-white hover:bg-[#3f3f3f] transition-colors max-w-[85%] cursor-pointer"
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
                  className="rounded-full border border-[#727272] px-4 py-1.5 text-sm text-[#A8A8AA] hover:text-white transition-colors cursor-pointer"
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
