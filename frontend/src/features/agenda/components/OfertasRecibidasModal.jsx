import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../../libs/axios";
import { XMarkIcon, CalendarDaysIcon, StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

export default function OfertasRecibidasModal({ isOpen, onClose, requestId, onOfertaAceptada }) {
  const [show, setShow] = useState(false);
  const [sortOrder, setSortOrder] = useState("todos");
  const navigate = useNavigate();

  // Fetch offers for the request
  const { data: offers = [], isLoading, isError } = useQuery({
    queryKey: ["request-offers", requestId],
    queryFn: async () => {
      const response = await api.get(`/job-requests/${requestId}/offers`);
      return response.data;
    },
    enabled: isOpen && !!requestId,
  });

  // Mutation to accept offer
  const { mutate: acceptOffer, isPending: isAccepting } = useMutation({
    mutationFn: async (offerId) => {
      const response = await api.post(`/offers/${offerId}/accept`);
      return response.data;
    },
    onSuccess: () => {
      if (onOfertaAceptada) onOfertaAceptada();
    },
    onError: (error) => {
      console.error("Error aceptando la oferta:", error);
      alert(error?.response?.data?.error?.message || "Ocurrió un error al aceptar la oferta.");
    }
  });

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen && !show) return null;

  // Sorting logic
  let displayedOffers = [...offers];
  if (sortOrder === "price_asc") {
    displayedOffers.sort((a, b) => a.amount - b.amount);
  } else if (sortOrder === "rating_desc") {
    displayedOffers.sort((a, b) => (b.professional?.rating_avg || 0) - (a.professional?.rating_avg || 0));
  }

  // Helper function to format the avatar
  const getAvatar = (prof) => {
    if (prof.avatar_url) {
      if (prof.avatar_url.startsWith('http')) return prof.avatar_url;
      const baseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      if (baseUrl) return `${baseUrl}/storage/v1/object/public/avatars/${prof.avatar_url}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(prof.name)}&background=random&color=fff&size=150`;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const totalStars = 5;

    return (
      <div className="flex items-center text-[#F78736] gap-0.5">
        {[...Array(totalStars)].map((_, i) => {
          if (i < fullStars) return <StarSolid key={i} className="h-4 w-4" />;
          if (i === fullStars && hasHalfStar) return <StarSolid key={i} className="h-4 w-4 opacity-50" />; 
          return <StarOutline key={i} className="h-4 w-4" />;
        })}
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative z-10 w-full max-w-4xl max-h-[90vh] bg-[#202020] rounded-[8px] border border-[#323232] shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#323232] px-8 py-6">
          <h2 className="text-xl font-bold text-white tracking-wider">
            Ofertas recibidas
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#A8A8AA] hover:bg-[#292929] hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Filters/Sort */}
        <div className="flex shrink-0 items-center justify-between px-8 py-4 border-b border-[#323232]">
          <span className="text-sm font-medium text-white">
            Tenés {offers.length} {offers.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#A8A8AA]">Ordenar por:</span>
            <div className="w-40">
              <Select
                options={[
                  { value: "todos", label: "todos" },
                  { value: "price_asc", label: "Menor precio" },
                  { value: "rating_desc", label: "Mejor calificados" }
                ]}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-[#292929] text-white"
              />
            </div>
          </div>
        </div>

        {/* Content (Scrollable list of offers) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {isLoading ? (
            <div className="text-center text-[#A8A8AA] py-10">Cargando ofertas...</div>
          ) : isError ? (
            <div className="text-center text-red-400 py-10">Error al cargar las ofertas.</div>
          ) : displayedOffers.length === 0 ? (
            <div className="text-center text-[#A8A8AA] py-10">Aún no has recibido ofertas para esta solicitud.</div>
          ) : (
            <div className="flex flex-col gap-6">
              {displayedOffers.map((offer) => (
                <div key={offer.id} className="bg-[#292929] border border-[#3a3a3a] rounded-[8px] p-6 flex flex-col gap-4">
                  
                  {/* Top section */}
                  <div className="flex justify-between items-start gap-4">
                    {/* Professional Info */}
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-[#202020] shrink-0">
                        <img src={getAvatar(offer.professional)} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white">{offer.professional.name}</h3>
                          {renderStars(offer.professional.rating_avg || 0)}
                        </div>
                        <span className="text-xs text-[#A8A8AA] tracking-wider uppercase mt-1">ELECTRICISTA</span>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-white">
                        ${Number(offer.amount).toLocaleString('es-AR')}
                      </span>
                      <span className="text-xs text-[#A8A8AA] mt-1">
                        Seña requerida: ${Number(offer.proposed_deposit).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="text-sm text-[#A8A8AA] mt-2 mb-2 leading-relaxed">
                    "{offer.message}"
                  </div>

                  {/* Bottom section */}
                  <div className="flex items-center justify-between border-t border-[#3a3a3a] pt-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-[#A8A8AA]">
                      <CalendarDaysIcon className="h-5 w-5" />
                      <span>Disponibilidad: <strong className="text-white font-medium">{offer.proposed_date} a las {offer.proposed_time.substring(0,5)}hs</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        className="border border-[#3a3a3a] text-white hover:bg-[#323232]"
                        onClick={() => navigate(`/client/professional/${offer.professional.id}`)}
                      >
                        Ver Perfil Profesional
                      </Button>
                      <Button 
                        variant="primary" 
                        className="bg-[#F78736] hover:bg-[#E0722D] text-white"
                        onClick={() => acceptOffer(offer.id)}
                        disabled={isAccepting}
                      >
                        {isAccepting ? "Aceptando..." : "Aceptar Oferta"}
                      </Button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
