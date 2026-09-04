import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

/** Sección CTA final — fondo naranja (CA07) */
export default function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="cta-final-heading" className="bg-orange-500 px-6 py-20 text-center">
      <div className="mx-auto max-w-[600px]">
        <h2 id="cta-final-heading" className="text-2xl font-bold text-white">
          ¿Necesitás un profesional hoy mismo?
        </h2>
        <p className="mx-auto mt-4 text-sm leading-relaxed text-white/80">
          Publicá tu solicitud de forma gratuita y empezá a recibir ofertas de
          profesionales verificados en minutos.
        </p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.LOGIN)}
          className="mt-8 rounded-[6px] bg-[#1a1a1a] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Publicar solicitud gratis
        </button>
      </div>
    </section>
  );
}
