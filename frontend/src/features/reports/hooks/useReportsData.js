import { useState, useMemo, useCallback } from "react";
import { mockInquiries } from "../data/mockReportsData";
import { INQUIRY_STATES } from "../constants/reports.constants";

/**
 * useReportsData — Hook para manejar el listado, filtrado, detalle y respuesta a consultas de usuarios.
 */
export function useReportsData() {
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtrado dinámico por nombre de usuario, asunto o ID (CA02)
  const filteredInquiries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return inquiries;
    return inquiries.filter(
      (inq) =>
        (inq.usuario && inq.usuario.toLowerCase().includes(term)) ||
        (inq.asunto && inq.asunto.toLowerCase().includes(term)) ||
        (inq.id && inq.id.toLowerCase().includes(term)) ||
        (inq.rol && inq.rol.toLowerCase().includes(term))
    );
  }, [inquiries, searchTerm]);

  // Enviar respuesta a una consulta (CA04)
  const handleSendReply = useCallback((inquiryId, replyData) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1
    ).padStart(2, "0")}/${now.getFullYear()} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} PM`;

    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === inquiryId) {
          return {
            ...inq,
            estado: INQUIRY_STATES.ANSWERED,
            respuesta: replyData.mensaje,
            asuntoRespuesta: replyData.asunto,
            fechaRespuesta: formattedDate,
          };
        }
        return inq;
      })
    );

    // Actualizar también la consulta seleccionada si está abierta
    setSelectedInquiry((prev) => {
      if (prev && prev.id === inquiryId) {
        return {
          ...prev,
          estado: INQUIRY_STATES.ANSWERED,
          respuesta: replyData.mensaje,
          asuntoRespuesta: replyData.asunto,
          fechaRespuesta: formattedDate,
        };
      }
      return prev;
    });
  }, []);

  // Recarga / Reintento
  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setInquiries([...mockInquiries]);
      setIsLoading(false);
    }, 300);
  }, []);

  return {
    inquiries,
    filteredInquiries,
    searchTerm,
    setSearchTerm,
    selectedInquiry,
    setSelectedInquiry,
    handleSendReply,
    isLoading,
    error,
    refetch,
  };
}
