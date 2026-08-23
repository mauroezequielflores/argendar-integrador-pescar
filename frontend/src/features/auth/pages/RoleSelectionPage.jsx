import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import AuthCard from "../components/AuthCard";
import authBg from "../../../assets/images/auth-bg.png";

/**
 * RoleSelectionPage — Pantalla de selección de rol para registro.
 *
 * HU-00: Selección de rol de Usuario
 * Ruta: /role
 */
export default function RoleSelectionPage() {
  const navigate = useNavigate();

  const selectionPanel = (
    <div className="flex flex-col gap-8">
      {/* Título */}
      <div className="text-center">
        <h1 className="text-[22px] font-bold text-white leading-tight">
          Bienvenido a Argendar.
        </h1>
      </div>

      {/* Botones de selección de rol */}
      <div className="flex flex-col gap-3">
        {/* Soy Cliente */}
        <RoleDescription
          title="Soy Cliente"
          description="Quiero enviar solicitudes y contratar profesionales."
        />
        <button
          type="button"
          id="role-client"
          onClick={() => navigate(ROUTES.REGISTER_CLIENT)}
          className="w-full rounded-[6px] border border-[#3a3a3a] bg-[#2e2e2e] px-4 py-3 text-xs font-medium text-white transition-all duration-200 hover:border-[#FD7B03] hover:bg-[#3a3a3a] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD7B03]"
        >
          Soy Cliente
        </button>

        {/* Soy Profesional */}

        <button
          type="button"
          id="role-professional"
          onClick={() => navigate(ROUTES.REGISTER_PROFESSIONAL)}
          className="w-full rounded-[6px] bg-[#FD7B03] px-4 py-3 text-xs font-medium text-white transition-all duration-200 hover:bg-[#e06d00] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD7B03] focus-visible:ring-offset-2 focus-visible:ring-offset-[#202020]"
        >
          Soy Profesional
        </button>
        <RoleDescription
          title="Soy Profesional"
          description="Quiero crear ofertas y gestionar mis turnos."
          accent
        />
      </div>

      {/* Descripciones de roles */}
      <div className="flex flex-col gap-3">
      </div>

      {/* Link a login */}
      <p className="text-center text-xs text-[#A8A8AA]">
        ¿Ya tenés una cuenta?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-[#FD7B03] hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );

  return (
    <AuthCard
      leftPanel={selectionPanel}
      rightImage={authBg}
      rightOverlayText="Transformando la forma de contratar y ofrecer servicios para tu hogar."
    />
  );
}

function RoleDescription({ title, description, accent = false }) {
  return (
    <div className={`rounded-[6px] border p-3 ${accent ? "border-[#FD7B03]/30 bg-[#FD7B03]/5" : "border-[#3a3a3a] bg-transparent"}`}>
      <p className={`text-xs font-semibold ${accent ? "text-[#FD7B03]" : "text-[#A8A8AA]"}`}>
        {title}
      </p>
      <p className="mt-0.5 text-xs text-[#A8A8AA]">{description}</p>
    </div>
  );
}
