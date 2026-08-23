import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  MapPinIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import InfoAlert from "../../../components/ui/InfoAlert";
import { mockProfessionalProfile } from "../data/mockProfessionalProfile";

const PROFESIONES = ["Plomería", "Electricidad", "Frigorista"];

/** Mock de datos de edición. Reemplazar con datos reales del backend. */
const initialData = {
  nombre: mockProfessionalProfile.firstName,
  apellido: mockProfessionalProfile.lastName,
  dni: "",
  ubicacion: "",
  matricula: "",
  profesion: PROFESIONES[0],
  email: "carlos.martinez@email.com",
  emailPermiso: true,
  telefono: "",
  telefonoPermiso: true,
};

/* ── Toggle switch ──────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78736] ${
        checked ? "bg-[#F78736]" : "bg-[#3a3a3a]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ── Campo editable — siempre activo, lápiz enfoca el input ─────── */
function EditableField({ label, value, onChange, placeholder, required, prefix, hasCheck }) {
  const inputRef = useRef(null);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-medium text-[#A8A8AA]">
          {label}
          {required && <span className="ml-0.5 text-red-500"> *</span>}
        </label>
        {hasCheck && value && <CheckCircleSolid className="h-4 w-4 text-green-500" />}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center overflow-hidden rounded-[6px] border border-[#3a3a3a] bg-[#323232] focus-within:border-[#F78736] transition-colors">
          {prefix && (
            <span className="border-r border-[#3a3a3a] px-3 py-2.5 text-xs font-medium text-[#A8A8AA]">
              {prefix}
            </span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-[#A8A8AA] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[#3a3a3a] bg-[#323232] text-[#A8A8AA] transition-colors hover:border-[#F78736] hover:text-white"
        >
          <PencilSquareIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ── Encabezado de sección ──────────────────────────────────────── */
function SectionHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-[#A8A8AA]">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ── Tarjeta de ítem (Ubicación / Matrícula) ────────────────────── */
function InfoCard({ label, value, extra }) {
  return (
    <div className="flex items-start gap-3 rounded-[6px] border border-[#3a3a3a] bg-[#323232] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3a3a3a]">
        <MapPinIcon className="h-5 w-5 text-[#A8A8AA]" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#A8A8AA]">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-[#A8A8AA]">{value || "-"}</p>
        {extra && <p className="text-sm text-[#A8A8AA]">{extra}</p>}
      </div>
    </div>
  );
}

/* ── Pantalla principal ─────────────────────────────────────────── */
export default function EditProfileSettingsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialData);

  const set = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleBack = () => navigate("/professional/profile/profile-settings");
  const handleSave = () => navigate("/professional/profile");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* CA01 — Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#A8A8AA]">
        <span
          className="cursor-pointer transition-colors hover:text-white"
          onClick={() => navigate("/professional/profile")}
        >
          Mi perfil
        </span>
        <span>›</span>
        <span
          className="cursor-pointer transition-colors hover:text-white"
          onClick={handleBack}
        >
          Configurar perfil
        </span>
        <span>›</span>
        <span className="text-white">Editar configuraciones de perfil</span>
      </nav>

      {/* Contenedor principal */}
      <div className="flex flex-col gap-8 rounded-[6px] bg-[#292929] p-6">
        {/* Título */}
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Editar configuraciones de perfil
          </h1>
          <p className="mt-1 text-sm text-[#A8A8AA]">
            Podés agregar, modificar o corregir tu información personal y los
            datos de la cuenta.
          </p>
        </div>

        <hr className="border-[#3a3a3a]" />

        {/* CA02 — Información personal */}
        <div className="flex flex-col gap-4">
          <SectionHeader
            title="Información personal"
            description="Ahora podés modificar tus datos. Estos cambios se verán reflejados en tu perfil profesional."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <EditableField
              label="Nombre"
              value={form.nombre}
              onChange={set("nombre")}
              placeholder="Ingresá tu nombre"
              hasCheck
            />
            <EditableField
              label="Apellido"
              value={form.apellido}
              onChange={set("apellido")}
              placeholder="Ingresá tu apellido"
              hasCheck
            />
          </div>
          <InfoAlert>
            Asegurate de que el nombre coincida con tu documento de identidad
            para evitar problemas en futuras validaciones de pagos o servicios.
          </InfoAlert>
          <EditableField
            label="Número de documento"
            value={form.dni}
            onChange={set("dni")}
            placeholder="Ingresa tu número de documento"
            required
            prefix="DNI"
          />
          <InfoAlert>
            Tu número de documento nos ayuda a verificar tu identidad.
          </InfoAlert>
        </div>

        <hr className="border-[#3a3a3a]" />

        {/* CA03 — Ubicación */}
        <div className="flex flex-col gap-4">
          <SectionHeader
            title="Ubicación"
            description="Seleccionar una ubicación en nuestro mapa:"
            action={
              <button
                type="button"
                title="Editar ubicación (futura integración Google Maps)"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[#3a3a3a] bg-[#323232] text-[#A8A8AA] transition-colors hover:border-[#F78736] hover:text-white"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
            }
          />
          <InfoCard label="Ubicación profesional principal" value={form.ubicacion} />
        </div>

        <hr className="border-[#3a3a3a]" />

        {/* CA04 — Información profesional */}
        <div className="flex flex-col gap-4">
          <SectionHeader
            title="Información profesional"
            description="Completá nuestro formulario para que verificar tu matrícula."
            action={
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={() => {}}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-[6px] border border-[#3a3a3a] bg-[#323232] px-3 py-2 text-xs font-medium text-[#A8A8AA] transition-colors hover:border-[#F78736] hover:text-white"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  Subir matrícula
                </button>
              </>
            }
          />
          <InfoCard label="Matriculado en" value={form.matricula} extra="-" />

          {/* Dropdown profesión */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A8A8AA]">
              Profesión seleccionada
            </label>
            <div className="flex items-center gap-2">
              <select
                value={form.profesion}
                onChange={(e) => set("profesion")(e.target.value)}
                className="flex-1 appearance-none rounded-[6px] border border-[#3a3a3a] bg-[#323232] px-3 py-2.5 text-sm text-white focus:border-[#F78736] focus:outline-none"
              >
                {PROFESIONES.map((p) => (
                  <option key={p} value={p} className="bg-[#292929]">
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <hr className="border-[#3a3a3a]" />

        {/* CA05 — Datos de la cuenta */}
        <div className="flex flex-col gap-4">
          <SectionHeader title="Datos de la cuenta" />

          {/* Correo electrónico */}
          <EditableField
            label="Correo electrónico"
            value={form.email}
            onChange={set("email")}
            placeholder="tu@email.com"
            hasCheck
          />
          <div className="flex items-start justify-between gap-4 rounded-[6px] border border-[#3a3a3a] bg-[#323232] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">
                Permisos de comunicaciones
              </p>
              <p className="mt-0.5 text-xs text-[#A8A8AA]">
                Nos permiten enviarte comunicaciones de soporte o
                actualizaciones de la plataforma a tu correo electrónico.
              </p>
            </div>
            <Toggle checked={form.emailPermiso} onChange={set("emailPermiso")} />
          </div>

          {/* Teléfono */}
          <EditableField
            label="Número de teléfono"
            value={form.telefono}
            onChange={set("telefono")}
            placeholder="Ej: +54 11 1234-5678"
            required
          />
          <div className="flex items-start justify-between gap-4 rounded-[6px] border border-[#3a3a3a] bg-[#323232] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">
                Permisos de comunicaciones o verificación
              </p>
              <p className="mt-0.5 text-xs text-[#A8A8AA]">
                Nos permiten enviarte códigos de verificación y comunicaciones
                de tu cuenta a tu número de teléfono.
              </p>
            </div>
            <Toggle
              checked={form.telefonoPermiso}
              onChange={set("telefonoPermiso")}
            />
          </div>

          {/* Contraseña (solo lectura) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A8A8AA]">
              Contraseña<span className="ml-0.5 text-red-500"> *</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center rounded-[6px] border border-[#3a3a3a] bg-[#323232]">
                <input
                  type="text"
                  value="Cambiar contraseña"
                  readOnly
                  className="flex-1 cursor-default bg-transparent px-3 py-2.5 text-sm text-[#A8A8AA] focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[#3a3a3a] bg-[#323232] text-[#A8A8AA] transition-colors hover:border-[#F78736] hover:text-white"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <InfoAlert>
            En caso de cambiar contraseña deberá realizar la verificación de
            dos pasos.
          </InfoAlert>
        </div>
      </div>

      {/* CA06 — Botones footer */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-[6px] border border-[#3a3a3a] bg-transparent px-4 py-2.5 text-xs font-medium text-[#A8A8AA] transition-colors hover:border-[#F78736] hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-[6px] border border-[#3a3a3a] bg-transparent px-4 py-2.5 text-xs font-medium text-[#A8A8AA] transition-colors hover:border-[#F78736] hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#e06d00] active:scale-[0.98]"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
