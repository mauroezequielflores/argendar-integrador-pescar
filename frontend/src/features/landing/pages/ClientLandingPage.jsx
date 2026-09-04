import LandingHeader from "../components/LandingHeader";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import MainSectionsSection from "../components/MainSectionsSection";
import WhyArgendarSection from "../components/WhyArgendarSection";
import ChatbotSection from "../components/ChatbotSection";
import HowItWorksSection from "../components/HowItWorksSection";
import FAQSection from "../components/FAQSection";
import FinalCTASection from "../components/FinalCTASection";
import LandingFooter from "../components/LandingFooter";

/**
 * Landing page pública — Cliente y Profesional.
 * Rutas: /landing-page/client | /landing-page/professional
 * HeroSection detecta la ruta para resaltar la tarjeta correspondiente (CA05).
 */
export default function ClientLandingPage() {
  return (
    <div className="min-h-screen bg-[#161618]">
      <LandingHeader />

      {/* pt compensa el header fijo */}
      <main className="pt-[68px]">
        <HeroSection />
        <ServicesSection />
        <MainSectionsSection />
        <WhyArgendarSection />
        <ChatbotSection />
        <HowItWorksSection />
        <FAQSection />
        <FinalCTASection />
      </main>

      <LandingFooter />
    </div>
  );
}
