import React, { useState, useRef } from "react";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import HelpHero from "../components/HelpHero";
import QuickShortcuts from "../components/QuickShortcuts";
import ContactFormCard from "../components/ContactFormCard";
import FaqAccordion from "../components/FaqAccordion";
import ChatbotHelpCard from "../components/ChatbotHelpCard";
import ContactInfoCard from "../components/ContactInfoCard";

/**
 * HelpPage — Pantalla de Ayuda y Soporte (Cliente).
 * Ruta: /client/help
 */
export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const faqRef = useRef(null);

  const breadcrumbs = [
    { label: "Soporte", href: "/client/help" },
    { label: "Ayuda" },
  ];

  const handleScrollToFaq = () => {
    faqRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenChatbot = () => {
    // Si tienes un botón flotante de Chatbot, podemos abrirlo o disparar su evento
    const chatbotTrigger = document.querySelector('[aria-label="Abrir Chatbot"]');
    if (chatbotTrigger) {
      chatbotTrigger.click();
    }
  };

  return (
    <div className="flex flex-col gap-12 text-white font-sans w-full">
      {/* ── Breadcrumbs ──────────────────────────────────────────────── */}
      <Breadcrumbs items={breadcrumbs} />

      {/* ── Hero Principal (CA01) ────────────────────────────────────── */}
      <HelpHero
        userName="Nombre"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* ── Atajos Rápidos (CA02, CA03) ──────────────────────────────── */}
      <QuickShortcuts />

      {/* ── Grilla de 2 Columnas (Contenido + Barra Lateral) ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Columna Izquierda: Formulario + FAQ (CA04, CA05) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ContactFormCard />
          <FaqAccordion faqRef={faqRef} />
        </div>

        {/* Columna Derecha: Asistente Chatbot + Info de Contacto (CA06) */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <ChatbotHelpCard
            onOpenChatbot={handleOpenChatbot}
            onScrollToFaq={handleScrollToFaq}
          />
          <ContactInfoCard />
        </div>
      </div>
    </div>
  );
}

