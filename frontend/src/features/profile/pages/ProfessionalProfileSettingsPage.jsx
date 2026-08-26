import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  IdentificationIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  PencilIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import Button from "../../../components/ui/Button";
import ProgressBar from "../../../components/ui/ProgressBar";
import { mockProfessionalProfile } from "../data/mockProfessionalProfile";

/**
 * Mock de datos de configuración de perfil.
 * Reemplazar con datos reales del backend cuando estén disponibles.
 */
const mockSettings = {
  nombre: `${mockProfessionalProfile.firstName} ${mockProfessionalProfile.lastName}`,
  dni: null,           // null → pendiente
  ubicacion: null,     // null → pendiente
  matricula: null,     // null → pendiente (no obligatorio per CA08)
  profesion: null,     // null → pendiente (obligatorio)
  email: "carlos.martinez@email.com",
  emailVerificado: true,
  telefono: null,
  telefonoVerificado: false,
};

/* ── Sub-componentes ──────────────────────────────────────────── */

/** Fila de ítem de sólo lectura con ícono, textos y check opcional */
function InfoRow({ icon: Icon, primary, secondary, isComplete }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3a3a3a]">
        <Icon className="h-5 w-5 text-[#A8A8AA]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{primary}</p>
        <p className="text-xs text-[#A8A8AA]">{secondary}</p>
      </div>
      {isComplete && (
        <CheckCircleSolid className="h-5 w-5 shrink-0 text-green-500" />
      )}
    </div>
  );
}

/** Bloque agrupador de sección con título y filas separadas */
function Section({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A8A8AA]">
        {title}
      </h3>
      <div className="divide-y divide-[#3a3a3a] rounded-[6px] bg-[#323232] px-4">
        {children}
      </div>
    </div>
  );
}

/* ── Pantalla principal ───────────────────────────────────────── */

export default function ProfessionalProfileSettingsPage() {
  const navigate = useNavigate();

  const {
    nombre, dni, ubicacion, matricula, profesion,
    email, emailVerificado, telefono, telefonoVerificado,
  } = mockSettings;

  /**
   * Cálculo de completitud.
   * Matrícula excluida del cálculo per CA08.
   * Contraseña siempre cuenta como completa.
   */
  const completableItems = useMemo(() => [
    !!nombre,
    !!dni,
    !!ubicacion,
    !!profesion,
    !!email,
    !!telefono,
    true, // contraseña siempre completa
  ], [nombre, dni, ubicacion, profesion, email, telefono]);

  const completedCount = completableItems.filter(Boolean).length;
  const progress = Math.round((completedCount / completableItems.length) * 100);

  const handleBack = () => navigate("/professional/profile");

  return (
    <div className="flex w-full flex-col gap-4 p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#A8A8AA]">
        <span
          className="cursor-pointer transition-colors hover:text-white"
          onClick={handleBack}
        >
          Mi perfil
        </span>
        <span>›</span>
        <span className="font-medium text-white">Configurar perfil</span>
      </nav>

      {/* Contenedor principal */}
      <div className="flex min-h-[520px] flex-col justify-between rounded-lg border border-[#262626] bg-[#212121]">
        <div>
          {/* CA01 — Encabezado: título + descripción + botón Editar */}
          <div className="flex items-start justify-between gap-4 border-b border-[#2e2e2e] p-6 pb-5">
            <div>
              <h1 className="text-xl font-semibold text-white">Configurar perfil</h1>
              <p className="mt-1 text-xs text-[#8e8e93]">
                Podés agregar, modificar o corregir tu información personal y los datos de la cuenta.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="!w-auto shrink-0"
              onClick={() => navigate("/professional/profile/profile-settings/edit-profile-settings")}
            >
              <PencilIcon className="h-4 w-4" />
              Editar
            </Button>
          </div>

          {/* Secciones de datos */}
          <div className="flex flex-col gap-4 p-6">

          {/* CA02 — Información personal */}
          <Section title="Información personal">
            <InfoRow
              icon={UserIcon}
              primary={nombre || "Nombre pendiente"}
              secondary="Nombre y apellido."
              isComplete={!!nombre}
            />
            <InfoRow
              icon={IdentificationIcon}
              primary={dni ? `DNI ${dni}` : "DNI pendiente"}
              secondary="Número de DNI."
              isComplete={!!dni}
            />
          </Section>

          {/* CA03 — Ubicación */}
          <Section title="Ubicación">
            <InfoRow
              icon={MapPinIcon}
              primary={ubicacion || "Ubicación pendiente"}
              secondary="Ubicación principal del profesional."
              isComplete={!!ubicacion}
            />
          </Section>

          {/* CA04 — Información profesional */}
          <Section title="Información profesional">
            <InfoRow
              icon={AcademicCapIcon}
              primary={matricula || "Matrícula pendiente"}
              secondary="Condición del profesional."
              isComplete={!!matricula}
            />
            <InfoRow
              icon={BriefcaseIcon}
              primary={profesion || "Profesión pendiente"}
              secondary="Profesión seleccionada."
              isComplete={!!profesion}
            />
          </Section>

          {/* CA05 — Datos de la cuenta */}
          <Section title="Datos de la cuenta">
            <InfoRow
              icon={EnvelopeIcon}
              primary={email || "Email pendiente"}
              secondary="E-mail donde recibís comunicaciones."
              isComplete={emailVerificado}
            />
            <InfoRow
              icon={PhoneIcon}
              primary={telefono || "Pendiente"}
              secondary="Número donde recibís códigos de verificación y comunicaciones."
              isComplete={telefonoVerificado}
            />
            <InfoRow
              icon={LockClosedIcon}
              primary="Cambiar contraseña"
              secondary="Contraseña guardada."
              isComplete={true}
            />
          </Section>
          </div>
        </div>

        {/* CA06 — Botones Volver / Cancelar */}
        <div className="flex items-center justify-between border-t border-[#2e2e2e] p-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md border border-[#3e3e3e] bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2c2c2c]"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Volver
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-md border border-[#3e3e3e] bg-transparent px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2c2c2c]"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* CA07 — Tarjeta de progreso (visible mientras el perfil no esté completo) */}
      {progress < 100 && (
        <div className="flex flex-col gap-4 rounded-[6px] border border-[#3a3a3a] bg-[#292929] p-5">
          <p className="text-sm text-[#A8A8AA]">
            ¿Querés comenzar a enviar ofertas a posibles clientes de tu zona?{" "}
            <span className="font-semibold text-white">Completá tu perfil profesional</span>
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A8A8AA]">Completitud del perfil</span>
              <span className="font-medium text-white">{progress}% completado</span>
            </div>
            <ProgressBar progress={progress} />
          </div>
          <Button
            variant="primary"
            size="md"
            className="!w-auto self-start"
            onClick={() =>
              navigate("/professional/profile/profile-settings/edit-profile-settings")
            }
          >
            Completar perfil
          </Button>
        </div>
      )}
    </div>
  );
}
