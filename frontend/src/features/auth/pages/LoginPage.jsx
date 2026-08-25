import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../../validations/login.schema";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";
import { MESSAGES } from "../../../constants/messages";

import AuthCard from "../components/AuthCard";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

import authBg from "../../../assets/images/auth-bg.png";

/**
 * LoginPage — Pantalla de inicio de sesión.
 *
 * HU-03: Login de usuario (Cliente / Profesional / Administrador)
 * Ruta: /login
 *
 * DEMO: El botón "Iniciar sesión" redirige según el rol del usuario demo.
 * Cambiar `demoRole` para probar diferentes roles.
 */

// ─── Demo role selector ────────────────────────────────────────────────────
// Cambiá este valor para simular diferentes roles en el login demo:
const DEMO_LOGIN_ROLE = ROLES.CLIENTE;
//const DEMO_LOGIN_ROLE = ROLES.PROFESIONAL;
// ──────────────────────────────────────────────────────────────────────────

const ROLE_REDIRECT = {
  [ROLES.CLIENTE]: ROUTES.CLIENT_HOME,
  [ROLES.PROFESIONAL]: ROUTES.PROFESSIONAL_HOME,
  [ROLES.ADMINISTRADOR]: ROUTES.ADMIN_HOME,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      // DEMO: ignora las credenciales, autentica con usuario demo
      const user = await login(DEMO_LOGIN_ROLE);

      const redirectTo = ROLE_REDIRECT[user.role] || ROUTES.CLIENT_HOME;
      //const redirectTo = ROUTES.PROFESSIONAL_HOME;
      navigate(redirectTo, { replace: true });
    } catch {
      setServerError(MESSAGES.LOGIN_ERROR);
    }
  };

  const formPanel = (
    <div className="flex flex-col gap-6">
      {/* Título */}
      <div className="text-center">
        <h1 className="text-[22px] font-bold text-white leading-tight">
          Iniciar sesión.
        </h1>
        <p className="mt-1 text-xs text-[#A8A8AA]">
          Ingresá tus credenciales para acceder a tu cuenta.
        </p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <Input
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="Ej: ejemplo11@gmail.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Ej: ejEmplo123"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Recordarme */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-[#3a3a3a] bg-transparent accent-[#FD7B03] cursor-pointer"
              {...register("remember")}
            />
            <label htmlFor="remember" className="text-xs text-[#A8A8AA] cursor-pointer select-none">
              Recordarme
            </label>
          </div>
          <div>
            <Link
              to={ROUTES.LOGIN}
              className="text-xs text-[#A8A8AA] hover:text-[#FD7B03] transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>

          </div>
        </div>


        {/* Error de servidor */}
        {serverError && (
          <p role="alert" className="rounded-[6px] bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {serverError}
          </p>
        )}

        <Button type="submit" variant="primary" isLoading={isLoading}>
          Iniciar sesión
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
          Continuar con Google
        </button>
      </form>

      {/* Links */}
      <div className="flex flex-col items-center gap-2">

        <p className="text-xs text-[#A8A8AA]">
          ¿No tenés una cuenta?{" "}
          <Link
            to={ROUTES.ROLE_SELECTION}
            className="font-medium text-[#FD7B03] hover:underline"
          >
            Registrarme
          </Link>
        </p>
      </div>
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
