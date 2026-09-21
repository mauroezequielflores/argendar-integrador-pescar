import React, { useState } from "react";

export default function ContactFormCard() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject("");
      setMessage("");
    }, 3000);
  };

  const handleCancel = () => {
    setSubject("");
    setMessage("");
  };

  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5 pb-20">
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-white">
          Envianos una consulta
        </h3>
        <p className="mt-1 text-xs text-[#A8A8AA]">
          Si no encontraste lo que buscabas, nuestro equipo te responderá a la brevedad.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Asunto */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="asunto" className="text-xs text-[#A8A8AA]">
            Asunto
          </label>
          <input
            id="asunto"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Escribí un resumen de tu consulta"
            className="w-full rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2 text-xs text-white placeholder-[#A8A8AA] transition-colors focus:border-[#F78736] focus:outline-none"
          />
        </div>

        {/* Mensaje */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="mensaje" className="text-xs text-[#A8A8AA]">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Contanos más detalles..."
            className="w-full rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2 text-xs text-white placeholder-[#A8A8AA] transition-colors focus:border-[#F78736] focus:outline-none resize-none"
          />
        </div>

        {/* Notificación de envío */}
        {submitted && (
          <div className="rounded-[6px] bg-[#202020] border border-emerald-500/50 p-2.5 text-xs text-emerald-400">
            ¡Consulta enviada exitosamente! Te responderemos pronto.
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-[6px] border border-[#323232] bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#323232] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-[6px] bg-[#F78736] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#e5782c] cursor-pointer"
          >
            Enviar consulta
          </button>
        </div>
      </form>
    </div>
  );
}
