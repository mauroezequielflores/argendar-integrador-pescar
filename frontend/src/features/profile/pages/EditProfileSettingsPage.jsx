import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PencilSquareIcon,
  MapPinIcon,
  ArrowLeftIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import InfoAlert from "../../../components/ui/InfoAlert";
import Loader from "../../../components/ui/Loader";
import Button from "../../../components/ui/Button";
import { api } from "../../../libs/axios";

const PROFESIONES = ["Plomería", "Electricidad", "Frigorista"];

/* ── Modal Cambio de Contraseña ─────────────────────────────────── */
function ChangePasswordModal({ isOpen, onClose }) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.patch('/auth/change-password', { password });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setPassword("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || "Ocurrió un error al cambiar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-[#3a3a3a] bg-[#212121] p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A8A8AA] hover:text-white"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold text-white mb-4">Cambiar contraseña</h2>
        {success ? (
          <div className="rounded bg-green-500/10 p-4 text-green-500 text-sm text-center">
            Contraseña cambiada exitosamente.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#A8A8AA]">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                className="rounded-[6px] border border-[#3a3a3a] bg-[#323232] px-3 py-2.5 text-sm text-white placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-[#A8A8AA] hover:text-white"
              >
                Cancelar
              </button>
              <Button type="submit" variant="primary" isLoading={isLoading} disabled={!password}>
                Guardar
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

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
  const location = useLocation();
  const match = location.pathname.match(/^\/(professional|client)/);
  const prefix = match ? `/${match[1]}` : "";
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    location: "",
    phone: "",
    email: "",
    emailAlerts: true,
    phoneAlerts: true,
    matricula: "",
    profesion: PROFESIONES[0],
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!prefix) return;
      try {
        const response = await api.get(`${prefix}/profile/settings`);
        const { personalInfo, location: loc, accountData } = response.data;
        
        setForm((prev) => ({
          ...prev,
          firstName: personalInfo?.firstName || "",
          lastName: personalInfo?.lastName || "",
          dni: personalInfo?.dni || "",
          location: loc?.address || "",
          email: accountData?.email || "",
          phone: accountData?.phone || "",
          emailAlerts: true, // Valores por defecto o del API si existen
          phoneAlerts: true,
        }));
      } catch (error) {
        console.error("Error al cargar las configuraciones:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [prefix]);

  const set = (field) => (value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleBack = () => navigate(`${prefix}/profile/profile-settings`);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        dni: form.dni,
        location: form.location,
        phone: form.phone,
        emailAlerts: form.emailAlerts,
        phoneAlerts: form.phoneAlerts
      };

      await api.patch(`${prefix}/profile/settings`, payload);
      // Dispatch event para actualizar Navbar si se cambió el nombre
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      navigate(`${prefix}/profile/profile-settings`);
    } catch (error) {
      console.error("Error al guardar configuraciones:", error);
      alert(error.response?.data?.error?.message || error.response?.data?.message || "Ocurrió un error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[500px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 p-6">
      {/* CA01 — Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#A8A8AA]">
        <span
          className="cursor-pointer transition-colors hover:text-white"
          onClick={() => navigate(`${prefix}/profile`)}
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
      <div className="rounded-lg border border-[#262626] bg-[#212121]">
        {/* Título */}
        <div className="border-b border-[#2e2e2e] p-6 pb-5">
          <h1 className="text-xl font-semibold text-white">
            Editar configuraciones de perfil
          </h1>
          <p className="mt-1 text-xs text-[#8e8e93]">
            Podés agregar, modificar o corregir tu información personal y los
            datos de la cuenta.
          </p>
        </div>

        <div className="flex flex-col gap-8 p-6">
        <hr className="border-[#2e2e2e]" />

        {/* CA02 — Información personal */}
        <div className="flex flex-col gap-4">
          <SectionHeader
            title="Información personal"
            description="Ahora podés modificar tus datos. Estos cambios se verán reflejados en tu perfil."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <EditableField
              label="Nombre"
              value={form.firstName}
              onChange={set("firstName")}
              placeholder="Ingresá tu nombre"
              hasCheck={form.firstName.length > 0}
            />
            <EditableField
              label="Apellido"
              value={form.lastName}
              onChange={set("lastName")}
              placeholder="Ingresá tu apellido"
              hasCheck={form.lastName.length > 0}
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
          <EditableField
            label="Dirección"
            value={form.location}
            onChange={set("location")}
            placeholder="Ej: Buenos Aires, Argentina"
          />
        </div>

        {/* CA04 — Información profesional (SOLO PARA PROFESIONALES) */}
        {prefix === "/professional" && (
          <>
            <hr className="border-[#3a3a3a]" />
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
          </>
        )}

        <hr className="border-[#3a3a3a]" />

        {/* CA05 — Datos de la cuenta */}
        <div className="flex flex-col gap-4">
          <SectionHeader title="Datos de la cuenta" />

          {/* Correo electrónico */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A8A8AA]">
              Correo electrónico
            </label>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center rounded-[6px] border border-[#3a3a3a] bg-[#292929]">
                <input
                  type="text"
                  value={form.email}
                  readOnly
                  disabled
                  className="flex-1 cursor-not-allowed bg-transparent px-3 py-2.5 text-sm text-[#A8A8AA] focus:outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-[#A8A8AA]">El correo electrónico no se puede modificar.</p>
          </div>

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
            <Toggle checked={form.emailAlerts} onChange={set("emailAlerts")} />
          </div>

          {/* Teléfono */}
          <EditableField
            label="Número de teléfono"
            value={form.phone}
            onChange={set("phone")}
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
              checked={form.phoneAlerts}
              onChange={set("phoneAlerts")}
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
                onClick={() => setIsPasswordModalOpen(true)}
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
        </div>{/* cierre flex flex-col gap-8 p-6 */}
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
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            className="px-6"
          >
            Guardar cambios
          </Button>
        </div>
      </div>
      
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}
