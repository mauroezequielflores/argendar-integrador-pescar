import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  PlusIcon,
  CalendarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../../../context/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { FAQ_ITEMS, CONTACT_INFO, SHORTCUTS } from "../data/mockProfessionalHelp";

// ─── Íconos por shortcut ─────────────────────────────────────────────────────

const SHORTCUT_ICONS = {
  perfil: UserCircleIcon,
  privacidad: ShieldCheckIcon,
  pagos: CreditCardIcon,
  oferta: PlusIcon,
  turnos: CalendarIcon,
};

// ─── ShortcutCard ─────────────────────────────────────────────────────────────

function ShortcutCard({ shortcut }) {
  const navigate = useNavigate();
  const Icon = SHORTCUT_ICONS[shortcut.id];

  return (
    <button
      onClick={() => navigate(shortcut.to)}
      className="flex items-center gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-4 text-left hover:border-[#F78736] transition-colors w-full"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#323232]">
        <Icon className="h-5 w-5 text-[#A8A8AA]" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold text-white">{shortcut.label}</p>
        <p className="text-xs text-[#A8A8AA]">{shortcut.description}</p>
      </div>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-[#A8A8AA]" />
    </button>
  );
}

// ─── FAQAccordion ─────────────────────────────────────────────────────────────

function FAQAccordion({ faqRef }) {
  const [openId, setOpenId] = useState(FAQ_ITEMS[0].id);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div ref={faqRef} className="flex flex-col gap-2">
      {FAQ_ITEMS.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="rounded-[6px] border border-[#323232] bg-[#292929] overflow-hidden"
          >
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm font-medium text-white">{item.pregunta}</span>
              {isOpen ? (
                <ChevronUpIcon className="h-4 w-4 shrink-0 text-[#A8A8AA]" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 shrink-0 text-[#A8A8AA]" />
              )}
            </button>
            {isOpen && (
              <div className="border-t border-[#323232] px-4 py-3">
                <p className="text-xs text-[#A8A8AA] leading-relaxed">{item.respuesta}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ContactForm ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [modal, setModal] = useState(null); // null | "success" | "error"

  const handleCancel = () => {
    setAsunto("");
    setMensaje("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simula envío: éxito si hay asunto y mensaje, error si están vacíos
    if (asunto.trim() && mensaje.trim()) {
      setModal("success");
    } else {
      setModal("error");
    }
  };

  return (
    <>
      <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-6 flex flex-col gap-4">
        <div>
          <p className="text-base font-semibold text-white">Envianos una consulta</p>
          <p className="text-xs text-[#A8A8AA] mt-1">
            Si no encontraste lo que buscabas, nuestro equipo te responderá a la brevedad.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Asunto */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white">Asunto</label>
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="Escribí un resumen de tu consulta"
              className="rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2.5 text-sm text-white placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none"
            />
          </div>

          {/* Mensaje */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white">Mensaje</label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Contanos más detalles..."
              rows={5}
              className="resize-none rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2.5 text-sm text-white placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-[6px] border border-[#323232] bg-transparent px-4 py-2.5 text-xs font-medium text-white hover:bg-[#323232] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors"
            >
              Enviar consulta
            </button>
          </div>
        </form>
      </div>

      {/* Modal resultado */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-sm rounded-[6px] border border-[#323232] bg-[#292929] p-6 flex flex-col items-center gap-4 text-center mx-4">
            <button
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 text-[#A8A8AA] hover:text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            {modal === "success" ? (
              <>
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
                <p className="text-base font-semibold text-white">¡Consulta recibida!</p>
                <p className="text-sm text-[#A8A8AA]">
                  Tu consulta fue enviada correctamente. Nuestro equipo te responderá a la brevedad.
                </p>
              </>
            ) : (
              <>
                <ExclamationCircleIcon className="h-12 w-12 text-red-500" />
                <p className="text-base font-semibold text-white">No pudimos enviar tu consulta</p>
                <p className="text-sm text-[#A8A8AA]">
                  Completá los campos Asunto y Mensaje antes de enviar.
                </p>
              </>
            )}
            <button
              onClick={() => setModal(null)}
              className="mt-2 w-full rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── ChatbotCard ──────────────────────────────────────────────────────────────

function ChatbotCard({ onVerFAQ }) {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#323232]">
          <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-[#F78736]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">¿Necesitás ayuda inmediata?</p>
          <p className="text-xs text-[#A8A8AA] mt-1">
            Nuestro asistente inteligente está disponible 24/7 para resolver dudas rápidas.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-[#A8A8AA] uppercase tracking-wide">Ejemplos:</p>
        <div className="rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2 text-xs text-[#A8A8AA]">
          "Olvidé mi contraseña"
        </div>
        <div className="rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2 text-xs text-[#A8A8AA]">
          "Problemas con Mercado Pago"
        </div>
      </div>

      <button
        onClick={() => setChatbotOpen(true)}
        className="w-full rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors"
      >
        Abrir Chatbot
      </button>
      <button
        onClick={onVerFAQ}
        className="w-full rounded-[6px] border border-[#323232] bg-transparent px-4 py-2.5 text-xs font-medium text-white hover:bg-[#323232] transition-colors"
      >
        Ver preguntas frecuentes
      </button>

      {/* Widget chatbot simulado */}
      {chatbotOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div className="w-80 rounded-[6px] border border-[#323232] bg-[#292929] shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between bg-[#F78736] px-4 py-3">
              <span className="text-sm font-semibold text-white">Asistente Argendar</span>
              <button onClick={() => setChatbotOpen(false)}>
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div className="rounded-[6px] bg-[#323232] px-3 py-2 text-xs text-white max-w-[80%]">
                ¡Hola! ¿En qué puedo ayudarte hoy?
              </div>
            </div>
            <div className="flex gap-2 border-t border-[#323232] p-3">
              <input
                type="text"
                placeholder="Escribí tu consulta..."
                className="flex-1 rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2 text-xs text-white placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none"
              />
              <button className="rounded-[6px] bg-[#F78736] px-3 py-2 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors">
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ContactInfoCard ──────────────────────────────────────────────────────────

function ContactInfoCard() {
  return (
    <div className="rounded-[6px] border border-[#323232] bg-[#292929] p-5 flex flex-col gap-4">
      <p className="text-sm font-semibold text-white">Información de Contacto</p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#A8A8AA]">
            Correo de soporte
          </p>
          <p className="text-sm text-white">{CONTACT_INFO.email}</p>
        </div>

        <div className="h-px bg-[#323232]" />

        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#A8A8AA]">
            Horario de atención
          </p>
          <p className="text-sm text-white">{CONTACT_INFO.horario}</p>
        </div>

        <div className="h-px bg-[#323232]" />

        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#A8A8AA]">
            Tiempo promedio de respuesta
          </p>
          <p className="text-sm text-white">{CONTACT_INFO.tiempoRespuesta}</p>
        </div>

        <div className="h-px bg-[#323232]" />

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-sm text-white">
            Estado del servicio: {CONTACT_INFO.estadoServicio}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ProfessionalHelpPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const faqRef = useRef(null);

  const firstName = user?.name ?? "Profesional";

  const scrollToFAQ = () => {
    faqRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#A8A8AA]">
        <span className="cursor-pointer hover:text-white transition-colors"
          onClick={() => navigate(ROUTES.PROFESSIONAL_HELP)}>
          Soporte
        </span>
        <span>/</span>
        <span className="text-white">Ayuda</span>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Hola, {firstName} ¿Con qué te ayudamos?
          </h1>
          <p className="mt-2 text-sm text-[#A8A8AA]">
            Encontrá guías, tutoriales y contactá con nuestro equipo de soporte.
          </p>
        </div>
        <div className="relative w-full max-w-xl">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A8AA]" />
          <input
            type="text"
            placeholder="¿Cómo puedo cancelar una oferta..."
            className="w-full rounded-[6px] border border-[#323232] bg-[#292929] py-3 pl-10 pr-4 text-sm text-white placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none"
          />
        </div>
      </div>

      {/* Atajos Rápidos */}
      <div className="flex flex-col gap-4">
        <p className="text-base font-semibold text-white">Atajos Rápidos</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SHORTCUTS.slice(0, 3).map((s) => (
            <ShortcutCard key={s.id} shortcut={s} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SHORTCUTS.slice(3).map((s) => (
            <ShortcutCard key={s.id} shortcut={s} />
          ))}
        </div>
      </div>

      {/* Layout 2 columnas */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Columna izquierda */}
        <div className="flex flex-1 flex-col gap-6">
          <ContactForm />

          {/* FAQ */}
          <div className="flex flex-col gap-4">
            <p className="text-base font-semibold text-white">Preguntas Frecuentes</p>
            <FAQAccordion faqRef={faqRef} />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex w-full flex-col gap-4 lg:w-72 lg:shrink-0">
          <ChatbotCard onVerFAQ={scrollToFAQ} />
          <ContactInfoCard />
        </div>
      </div>
    </div>
  );
}
