import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "../../../validations/register.schema";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import AuthCard from "../../../components/ui/AuthCard";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

import authBg from "../../../assets/images/auth-bg.png";

/**
 * RegisterPage — Pantalla de registro para Cliente y Profesional.
 *
 * HU-01: Registro de Cliente    → /register/client
 * HU-02: Registro de Profesional → /register/professional
 *
 * El rol se determina automáticamente desde la URL.
 */

const ROLE_FROM_PARAM = {
  client: ROLES.CLIENTE,
  professional: ROLES.PROFESIONAL,
};

const ROLE_REDIRECT = {
  [ROLES.CLIENTE]: ROUTES.CLIENT_HOME,
  [ROLES.PROFESIONAL]: ROUTES.PROFESSIONAL_HOME,
};

export default function RegisterPage() {
  const { role: roleParam } = useParams();
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [serverError, setServerError] = useState("");

  const currentRole = ROLE_FROM_PARAM[roleParam] || ROLES.CLIENTE;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      aceptarTerminos: false,
    },
  });

  // Indicador de fortaleza de contraseña en tiempo real
  const passwordValue = watch("password", "");
  const strengthRules = [
    { label: "Mínimo 8 caracteres", met: passwordValue.length >= 8 },
    { label: "Al menos una mayúscula", met: /[A-Z]/.test(passwordValue) },
    { label: "Al menos un número", met: /[0-9]/.test(passwordValue) },
  ];
  const showStrength = passwordValue.length > 0;

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const user = await registerUser(data, currentRole);
      const redirectTo = ROLE_REDIRECT[user.role] || ROUTES.CLIENT_HOME;
      navigate(redirectTo, { replace: true });
    } catch {
      setServerError("Ocurrió un error al crear la cuenta. Intentá de nuevo.");
    }
  };

  const formPanel = (
    <div className="flex flex-col gap-5">


      {/* Título */}
      <div className="text-center">
        <h1 className="text-[22px] font-bold text-white leading-tight">
          Bienvenido a Argendar.
        </h1>
        <p className="mt-1 text-xs text-[#A8A8AA]">
          Únete a nuestra comunidad y transforma tu día a día.
        </p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Nombre y Apellido en fila */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="nombre"
            label="Nombre"
            type="text"
            placeholder="Ej: Lucía"
            error={errors.nombre?.message}
            {...register("nombre")}
          />
          <Input
            id="apellido"
            label="Apellido"
            type="text"
            placeholder="Ej: González"
            error={errors.apellido?.message}
            {...register("apellido")}
          />
        </div>

        <Input
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="Ej: ejemplo01@gmail.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="flex flex-col gap-1">
          <Input
            id="password"
            label="Contraseña"
            type="password"
            placeholder="Ej: ejEmplo123"
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Indicador de fortaleza */}
          {showStrength && (
            <div className="flex flex-col gap-1 mt-1">
              {strengthRules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${rule.met ? "bg-green-400" : "bg-[#3a3a3a]"
                      }`}
                  />
                  <span
                    className={`text-xs ${rule.met ? "text-green-400" : "text-[#A8A8AA]"
                      }`}
                  >
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aceptar términos */}
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <input
              id="aceptarTerminos"
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#3a3a3a] bg-transparent accent-[#FD7B03] cursor-pointer"
              {...register("aceptarTerminos")}
            />
            <label
              htmlFor="aceptarTerminos"
              className="text-xs text-[#A8A8AA] cursor-pointer select-none leading-snug"
            >
              Aceptar términos y condiciones.
            </label>
          </div>
          {errors.aceptarTerminos && (
            <p role="alert" className="text-xs text-red-400 ml-6">
              {errors.aceptarTerminos.message}
            </p>
          )}
        </div>

        {/* Error de servidor */}
        {serverError && (
          <p role="alert" className="rounded-[6px] bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {serverError}
          </p>
        )}

        <Button type="submit" variant="primary" isLoading={isLoading}>
          Registrarme ahora
        </Button>

        {/* Separador */}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-[#3a3a3a]" />
          <span className="text-xs text-[#A8A8AA]">o</span>
          <span className="h-px flex-1 bg-[#3a3a3a]" />
        </div>

        {/* Google */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-[6px] border border-[#3a3a3a] bg-transparent px-4 py-2.5 text-xs text-white transition-colors hover:bg-[#2e2e2e]"
        >
          <GoogleIcon />
          Registrarme con Google
        </button>
      </form>

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
      leftPanel={formPanel}
      rightImage={authBg}
      rightOverlayText="Transformando la forma de contratar y ofrecer servicios para tu hogar."
    />
  );
}

// ─── Ícono SVG de Google ────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}
