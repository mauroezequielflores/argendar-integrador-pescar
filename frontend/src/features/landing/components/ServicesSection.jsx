import plomeriaIcon     from "../../../assets/icons/servicios/plomeria.svg";
import electricistasIcon from "../../../assets/icons/servicios/electricistas.svg";
import frigoristasIcon   from "../../../assets/icons/servicios/frigoristas.svg";
import ServiceCard from "./ServiceCard";

const SERVICES = [
  { icon: plomeriaIcon,      label: "Plomería"      },
  { icon: electricistasIcon, label: "Electricistas" },
  { icon: frigoristasIcon,   label: "Frigoristas"   },
];

export default function ServicesSection() {
  return (
    <section
      id="servicios"
      aria-labelledby="servicios-heading"
      className="bg-[#181818] px-6 py-20"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Encabezado */}
        <div className="mb-12 text-center">
          <h2
            id="servicios-heading"
            className="text-2xl font-semibold text-white"
          >
            Servicios disponibles
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-sm text-[#DADADA]">
            Conectamos a profesionales especializados con personas que necesitan
            soluciones reales para su hogar.
          </p>
        </div>

        {/* Grilla: 1 col mobile → 3 col desktop */}
        <ul
          className="grid grid-cols-1 gap-6 sm:grid-cols-3"
          role="list"
          aria-label="Categorías de servicios disponibles"
        >
          {SERVICES.map(({ icon, label }) => (
            <ServiceCard key={label} icon={icon} label={label} />
          ))}
        </ul>
      </div>
    </section>
  );
}
