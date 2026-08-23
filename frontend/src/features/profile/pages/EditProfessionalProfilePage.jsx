import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  CameraIcon,
  PlusIcon,
  XMarkIcon,
  StarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import { ROUTES } from "../../../constants/routes";
import { mockProfessionalProfile } from "../data/mockProfessionalProfile";

// ─── Constantes ───────────────────────────────────────────────────────────────

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const DISPONIBILIDAD_INICIAL = [
  { dia: "Lunes",     activo: true,  franjas: [{ inicio: "08:00", fin: "19:00" }] },
  { dia: "Martes",    activo: true,  franjas: [{ inicio: "08:00", fin: "19:00" }] },
  { dia: "Miércoles", activo: true,  franjas: [{ inicio: "08:00", fin: "19:00" }] },
  { dia: "Jueves",    activo: true,  franjas: [{ inicio: "08:00", fin: "19:00" }] },
  { dia: "Viernes",   activo: true,  franjas: [{ inicio: "08:00", fin: "19:00" }] },
  { dia: "Sábado",    activo: true,  franjas: [{ inicio: "09:00", fin: "14:00" }] },
  { dia: "Domingo",   activo: false, franjas: [] },
];

const HABILIDADES_INICIALES = ["Instalaciones electrónicas", "Aire acondicionado"];

// ─── Helper: resumen de disponibilidad agrupado ───────────────────────────────

function calcularResumen(disponibilidad) {
  const grupos = [];
  let i = 0;
  while (i < disponibilidad.length) {
    const d = disponibilidad[i];
    if (!d.activo) {
      grupos.push({ label: d.dia, horario: "Cerrado" });
      i++;
      continue;
    }
    const horario =
      d.franjas.length > 0
        ? d.franjas.map((f) => `${f.inicio} - ${f.fin}`).join(", ")
        : "Sin horario";
    // Intentar agrupar días consecutivos con mismo horario y activos
    let j = i + 1;
    while (
      j < disponibilidad.length &&
      disponibilidad[j].activo &&
      disponibilidad[j].franjas.length === d.franjas.length &&
      disponibilidad[j].franjas.every(
        (f, k) => f.inicio === d.franjas[k]?.inicio && f.fin === d.franjas[k]?.fin
      )
    ) {
      j++;
    }
    const label =
      j - i > 1
        ? `${disponibilidad[i].dia} - ${disponibilidad[j - 1].dia}`
        : disponibilidad[i].dia;
    grupos.push({ label, horario });
    i = j;
  }
  return grupos;
}

// ─── Modal Disponibilidad ─────────────────────────────────────────────────────

function ModalDisponibilidad({ disponibilidad, onClose, onSave }) {
  const [local, setLocal] = useState(
    disponibilidad.map((d) => ({
      ...d,
      franjas: d.franjas.map((f) => ({ ...f })),
    }))
  );

  const toggleDia = (i) =>
    setLocal((prev) =>
      prev.map((d, idx) =>
        idx === i ? { ...d, activo: !d.activo, franjas: d.activo ? [] : [{ inicio: "09:00", fin: "18:00" }] } : d
      )
    );

  const agregarFranja = (i) =>
    setLocal((prev) =>
      prev.map((d, idx) =>
        idx === i ? { ...d, franjas: [...d.franjas, { inicio: "09:00", fin: "18:00" }] } : d
      )
    );

  const actualizarFranja = (diaIdx, franjaIdx, campo, valor) =>
    setLocal((prev) =>
      prev.map((d, i) =>
        i !== diaIdx
          ? d
          : {
              ...d,
              franjas: d.franjas.map((f, j) =>
                j === franjaIdx ? { ...f, [campo]: valor } : f
              ),
            }
      )
    );

  const eliminarFranja = (diaIdx, franjaIdx) =>
    setLocal((prev) =>
      prev.map((d, i) =>
        i !== diaIdx ? d : { ...d, franjas: d.franjas.filter((_, j) => j !== franjaIdx) }
      )
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-[6px] border border-[#323232] bg-[#292929] shadow-xl">
        {/* Header modal */}
        <div className="border-b border-[#323232] px-6 py-4">
          <h2 className="text-base font-semibold text-white">Disponibilidad Horaria</h2>
          <p className="mt-0.5 text-xs text-[#A8A8AA]">Configura tus horarios de atención por día.</p>
        </div>

        {/* Cuerpo */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {local.map((d, i) => (
            <div key={d.dia} className="flex flex-col gap-2">
              {/* Fila día + toggle */}
              <div className="flex items-center gap-3">
                {/* Toggle */}
                <button
                  onClick={() => toggleDia(i)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                    d.activo ? "bg-[#F78736]" : "bg-[#323232]"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                      d.activo ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="w-24 text-sm font-medium text-white">{d.dia}</span>
                {!d.activo && <span className="text-sm italic text-[#A8A8AA]">Cerrado</span>}
              </div>

              {/* Franjas si activo */}
              {d.activo && (
                <div className="ml-14 flex flex-col gap-2">
                  {d.franjas.map((f, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={f.inicio}
                        onChange={(e) => actualizarFranja(i, j, "inicio", e.target.value)}
                        className="rounded-[6px] border border-[#323232] bg-[#202020] px-2 py-1.5 text-xs text-white focus:border-[#F78736] focus:outline-none"
                      />
                      <span className="text-xs text-[#A8A8AA]">—</span>
                      <input
                        type="time"
                        value={f.fin}
                        onChange={(e) => actualizarFranja(i, j, "fin", e.target.value)}
                        className="rounded-[6px] border border-[#323232] bg-[#202020] px-2 py-1.5 text-xs text-white focus:border-[#F78736] focus:outline-none"
                      />
                      {d.franjas.length > 1 && (
                        <button onClick={() => eliminarFranja(i, j)}>
                          <XMarkIcon className="h-4 w-4 text-[#A8A8AA] hover:text-white" />
                        </button>
                      )}
                      <button
                        onClick={() => agregarFranja(i)}
                        className="flex items-center gap-1 rounded-[6px] border border-[#323232] bg-transparent px-2 py-1.5 text-xs text-[#A8A8AA] hover:text-white transition-colors"
                      >
                        <PlusIcon className="h-3 w-3" />
                        Agregar franja
                      </button>
                    </div>
                  ))}
                  {d.franjas.length === 0 && (
                    <button
                      onClick={() => agregarFranja(i)}
                      className="flex w-fit items-center gap-1 rounded-[6px] border border-[#323232] bg-transparent px-2 py-1.5 text-xs text-[#A8A8AA] hover:text-white transition-colors"
                    >
                      <PlusIcon className="h-3 w-3" />
                      Agregar franja
                    </button>
                  )}
                </div>
              )}

              {i < local.length - 1 && <div className="mt-1 h-px bg-[#323232]" />}
            </div>
          ))}
        </div>

        {/* Footer modal */}
        <div className="flex justify-end gap-3 border-t border-[#323232] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-[6px] border border-[#323232] bg-transparent px-4 py-2.5 text-xs font-medium text-white hover:bg-[#323232] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(local)}
            className="rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function EditProfessionalProfilePage() {
  const navigate = useNavigate();
  const profile = mockProfessionalProfile;

  // Imágenes
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Biografía
  const [bio, setBio] = useState(
    "Biografia. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis."
  );

  // Habilidades
  const [habilidades, setHabilidades] = useState(HABILIDADES_INICIALES);
  const [mostrandoInput, setMostrandoInput] = useState(false);
  const [nuevaHabilidad, setNuevaHabilidad] = useState("");

  // Disponibilidad
  const [disponibilidad, setDisponibilidad] = useState(DISPONIBILIDAD_INICIAL);
  const [modalAbierto, setModalAbierto] = useState(false);

  // ── Handlers ──

  const handleImageChange = (e, setter) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const handleEliminarHabilidad = (idx) =>
    setHabilidades((prev) => prev.filter((_, i) => i !== idx));

  const handleConfirmarHabilidad = () => {
    const trimmed = nuevaHabilidad.trim();
    if (trimmed) setHabilidades((prev) => [...prev, trimmed]);
    setNuevaHabilidad("");
    setMostrandoInput(false);
  };

  const handleGuardarDisponibilidad = (nueva) => {
    setDisponibilidad(nueva);
    setModalAbierto(false);
  };

  const resumen = calcularResumen(disponibilidad);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="rounded-[6px] border border-[#323232] bg-[#292929]">
        {/* Banner */}
        <div
          className="relative flex h-24 cursor-pointer items-center justify-center rounded-t-[6px] bg-[#323232]"
          style={coverPreview ? { backgroundImage: `url(${coverPreview})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
          onClick={() => coverInputRef.current?.click()}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#202020]/70 hover:bg-[#202020] transition-colors">
            <CameraIcon className="h-5 w-5 text-white" />
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, setCoverPreview)}
          />
        </div>

        {/* Info row */}
        <div className="flex flex-col gap-4 px-6 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4 -mt-10">
            {/* Avatar */}
            <div
              className="relative shrink-0 cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E5E7EB]"
                style={avatarPreview ? { backgroundImage: `url(${avatarPreview})`, backgroundSize: "cover" } : {}}
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/50 transition-colors">
                <CameraIcon className="h-5 w-5 text-white" />
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, setAvatarPreview)}
              />
            </div>
            <div className="pb-1">
              <h1 className="text-xl font-bold text-white">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm text-[#A8A8AA]">{profile.titulo}</p>
            </div>
          </div>

          <button
            onClick={() => navigate(ROUTES.PROFESSIONAL_PROFILE)}
            className="flex shrink-0 items-center gap-2 self-start rounded-[6px] border border-[#323232] bg-transparent px-4 py-2 text-xs font-medium text-white hover:bg-[#323232] transition-colors sm:self-auto"
          >
            Guardar y volver a Mi perfil
          </button>
        </div>

        {/* Tab */}
        <div className="flex border-t border-[#323232] px-6">
          <div className="flex items-center gap-2 border-b-2 border-[#F78736] py-3 text-sm font-medium text-white">
            <PencilSquareIcon className="h-4 w-4" />
            Editar perfil profesional
          </div>
        </div>
      </div>

      {/* ── Sobre mí ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
        <h2 className="text-base font-semibold text-white">Sobre mí</h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#A8A8AA]">Biografía profesional</label>
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => e.target.value.length <= 1000 && setBio(e.target.value)}
              rows={5}
              className="w-full resize-none rounded-[6px] border border-[#323232] bg-[#202020] px-3 py-2.5 text-sm text-white placeholder-[#A8A8AA] focus:border-[#F78736] focus:outline-none"
            />
            <span className="absolute bottom-2 right-3 text-xs text-[#A8A8AA]">
              {bio.length} / 1000
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors">
            Guardar cambios
          </button>
        </div>
      </div>

      {/* ── Habilidades ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
        <div>
          <h2 className="text-base font-semibold text-white">Habilidades</h2>
          <p className="mt-0.5 text-xs text-[#A8A8AA]">
            Incorporá etiquetas visibles en tu perfil profesional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {habilidades.map((h, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 rounded-full border border-[#323232] bg-[#323232] px-3 py-1 text-xs text-white"
            >
              {h}
              <button onClick={() => handleEliminarHabilidad(i)}>
                <XMarkIcon className="h-3 w-3 text-[#A8A8AA] hover:text-white" />
              </button>
            </span>
          ))}

          {mostrandoInput ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                type="text"
                value={nuevaHabilidad}
                onChange={(e) => setNuevaHabilidad(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirmarHabilidad()}
                onBlur={handleConfirmarHabilidad}
                placeholder="Nueva habilidad"
                className="rounded-[6px] border border-[#F78736] bg-[#202020] px-3 py-1 text-xs text-white placeholder-[#A8A8AA] focus:outline-none"
              />
            </div>
          ) : (
            <button
              onClick={() => setMostrandoInput(true)}
              className="flex items-center gap-1 rounded-full border border-[#323232] px-3 py-1 text-xs text-[#A8A8AA] hover:border-[#F78736] hover:text-white transition-colors"
            >
              <PlusIcon className="h-3 w-3" />
              Agregar etiqueta
            </button>
          )}
        </div>

        <div className="flex justify-end">
          <button className="rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors">
            Guardar cambios
          </button>
        </div>
      </div>

      {/* ── Disponibilidad Horaria ───────────────────────────────────── */}
      <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
        <div>
          <h2 className="text-base font-semibold text-white">Disponibilidad Horaria</h2>
          <p className="mt-0.5 text-xs text-[#A8A8AA]">
            Incorporá tu disponibilidad visible en tu perfil profesional.
          </p>
        </div>

        {/* Resumen de solo lectura */}
        <div className="rounded-[6px] border border-[#323232] bg-[#202020]">
          {resumen.map((g, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                i < resumen.length - 1 ? "border-b border-[#323232]" : ""
              }`}
            >
              <span className="text-white">{g.label}</span>
              <span className={g.horario === "Cerrado" ? "text-[#A8A8AA]" : "text-white"}>
                {g.horario}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setModalAbierto(true)}
            className="rounded-[6px] bg-[#F78736] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#e06d00] transition-colors"
          >
            Modificar horarios
          </button>
        </div>
      </div>

      {/* ── Aviso informativo ────────────────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-[6px] border border-[#323232] bg-[#292929] p-4">
        <InformationCircleIcon className="h-5 w-5 shrink-0 text-[#A8A8AA] mt-0.5" />
        <p className="text-xs text-[#A8A8AA] leading-relaxed">
          Las calificaciones no se pueden modificar. Si sentís que hay algún error comunicate con
          Soporte en{" "}
          <a
            href="mailto:soporte@argendar.com"
            className="underline hover:text-white transition-colors"
          >
            soporte@argendar.com
          </a>{" "}
          ó navega a nuestra sección de{" "}
          <button
            onClick={() => navigate(ROUTES.PROFESSIONAL_HELP)}
            className="underline hover:text-white transition-colors"
          >
            Ayuda
          </button>
          .
        </p>
      </div>

      {/* ── Secciones desactivadas ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 opacity-50 pointer-events-none select-none lg:grid-cols-[280px_1fr]">
        {/* Resumen calificaciones */}
        <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
          <h2 className="text-base font-semibold text-white">Resumen de Calificaciones</h2>
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl font-bold text-white">
              {profile.rating.toFixed(1)}
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIconSolid key={s} className="h-5 w-5 text-[#323232]" />
              ))}
            </div>
            <p className="text-xs text-[#A8A8AA]">Basado en {profile.reviewsCount} reseñas</p>
          </div>
          <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3 text-xs text-[#A8A8AA]">
                <span className="w-2">{star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#323232]">
                  <div className="h-full rounded-full bg-[#F78736]" style={{ width: "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opiniones recientes */}
        <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
          <h2 className="text-base font-semibold text-white">Opiniones recientes</h2>
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#323232]">
              <StarIcon className="h-6 w-6 text-[#A8A8AA]" />
            </div>
            <p className="text-base font-semibold text-white">Aún no hay reseñas</p>
            <p className="max-w-xs text-sm text-[#A8A8AA]">
              Las opiniones de los clientes aparecerán aquí cuando comiencen a calificar el
              servicio.
            </p>
            <button
              disabled
              className="mt-2 cursor-not-allowed rounded-[6px] bg-[#F78736] px-6 py-2.5 text-sm font-medium text-white opacity-60"
            >
              Enviar ofertas
            </button>
          </div>
        </div>
      </div>

      {/* Modal disponibilidad */}
      {modalAbierto && (
        <ModalDisponibilidad
          disponibilidad={disponibilidad}
          onClose={() => setModalAbierto(false)}
          onSave={handleGuardarDisponibilidad}
        />
      )}
    </div>
  );
}
