import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { INQUIRY_STATES } from "../constants/reports.constants";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

/**
 * InquiryDetailModal — Modal para ver el detalle de una consulta y enviar respuesta al usuario (CA03, CA04).
 *
 * @param {boolean} isOpen - Estado de visibilidad del modal.
 * @param {function} onClose - Callback al cerrar el modal.
 * @param {object} inquiry - Consulta seleccionada.
 * @param {function} onSendReply - Callback al enviar la respuesta.
 */
export default function InquiryDetailModal({
  isOpen,
  onClose,
  inquiry,
  onSendReply,
}) {
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Inicializar campos cuando se abre una consulta
  useEffect(() => {
    if (inquiry) {
      setReplySubject(`Re: ${inquiry.asunto}`);
      setReplyMessage(inquiry.respuesta || "");
      setIsSuccess(false);
    }
  }, [inquiry]);

  if (!inquiry) return null;

  const isAnswered = inquiry.estado === INQUIRY_STATES.ANSWERED;
  const isSubmitDisabled = !replyMessage.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    onSendReply(inquiry.id, {
      asunto: replySubject.trim(),
      mensaje: replyMessage.trim(),
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de Consulta">
      <div className="flex flex-col gap-5">
        {/* ── Datos del Remitente (CA03) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[6px] bg-[#292929] p-4 border border-[#323232]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#202020]">
              {inquiry.usuario
                ? inquiry.usuario
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U"}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{inquiry.usuario}</p>
              <p className="text-xs text-[#A8A8AA]">
                <span className="text-[#F78736] font-medium">{inquiry.rol}</span> • {inquiry.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-xs text-[#A8A8AA]">{inquiry.fecha} {inquiry.hora || ""}</span>
            <span
              className={`mt-1 inline-flex items-center rounded-[6px] px-2.5 py-0.5 text-[11px] font-semibold ${
                inquiry.estado === INQUIRY_STATES.ANSWERED
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}
            >
              {inquiry.estado}
            </span>
          </div>
        </div>

        {/* ── Mensaje Original de la Consulta (CA03) ── */}
        <div className="flex flex-col gap-2 rounded-[6px] bg-[#292929] p-4 border border-[#323232]">
          <p className="text-xs font-semibold text-[#A8A8AA] uppercase tracking-wider">
            Asunto Original:
          </p>
          <p className="text-sm font-medium text-white">{inquiry.asunto}</p>

          <p className="mt-2 text-xs font-semibold text-[#A8A8AA] uppercase tracking-wider">
            Mensaje del Usuario:
          </p>
          <p className="text-xs text-[#d1d1d1] leading-relaxed whitespace-pre-wrap bg-[#202020] p-3 rounded-[6px] border border-[#323232]">
            {inquiry.mensaje}
          </p>
        </div>

        {/* ── Alerta de Éxito al Enviar ── */}
        {isSuccess && (
          <div className="flex items-center gap-2 rounded-[6px] bg-green-500/20 border border-green-500/40 p-3 text-xs text-green-400 font-medium">
            <CheckCircleIcon className="h-4 w-4 shrink-0" />
            <span>¡Respuesta enviada exitosamente! El estado ha cambiado a Respondida.</span>
          </div>
        )}

        {/* ── Formulario de Respuesta (CA04) ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="border-t border-[#323232] pt-4">
            <h4 className="text-sm font-semibold text-white">
              {isAnswered ? "Respuesta Enviada" : "Redactar Respuesta"}
            </h4>
            <p className="mt-0.5 text-xs text-[#A8A8AA]">
              {isAnswered
                ? `Respondido el ${inquiry.fechaRespuesta || "recientemente"}`
                : "Enviá una respuesta directa al usuario para resolver su consulta."}
            </p>
          </div>

          {/* Asunto de respuesta */}
          <div className="flex flex-col gap-1">
            <label htmlFor="replySubject" className="text-xs text-[#A8A8AA]">
              Asunto
            </label>
            <input
              id="replySubject"
              type="text"
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              placeholder="Asunto de la respuesta"
              disabled={isAnswered}
              className="w-full rounded-[6px] border border-[#3a3a3a] bg-[#292929] px-3 py-2 text-xs text-white placeholder-[#A8A8AA] transition-colors focus:border-[#F78736] focus:outline-none disabled:opacity-60"
            />
          </div>

          {/* Descripción / Mensaje de respuesta */}
          <div className="flex flex-col gap-1">
            <label htmlFor="replyMessage" className="text-xs text-[#A8A8AA]">
              Descripción / Mensaje de Respuesta <span className="text-[#F78736]">*</span>
            </label>
            <textarea
              id="replyMessage"
              rows={4}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Escribí tu respuesta detallada aquí..."
              disabled={isAnswered}
              className="w-full rounded-[6px] border border-[#3a3a3a] bg-[#292929] px-3 py-2 text-xs text-white placeholder-[#A8A8AA] transition-colors focus:border-[#F78736] focus:outline-none resize-none disabled:opacity-60"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[6px] border border-[#3a3a3a] bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#323232] cursor-pointer"
            >
              Cerrar
            </button>
            {!isAnswered && (
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="rounded-[6px] bg-[#F78736] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#e0752b] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Enviar respuesta
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
