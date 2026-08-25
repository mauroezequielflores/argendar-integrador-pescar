import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPasswordConfirmSchema } from "../../../validations/resetPassword.schema";
import { resetPasswordConfirm } from "../services/auth.service";
import { ROUTES } from "../../../constants/routes";

import AuthCenteredCard from "../components/AuthCenteredCard";
import AuthDivider from "../components/AuthDivider";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

/**
 * ResetPasswordConfirmPage — Pantalla para establecer nueva contraseña.
 *
 * Ruta: /reset-password/confirm
 */
export default function ResetPasswordConfirmPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);
    try {
      await resetPasswordConfirm({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN, { replace: true });
      }, 1500);
    } catch (error) {
      setServerError(error.message || "No se pudo restablecer la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCenteredCard>
      <div className="flex flex-col">
        {/* Título y subtítulo */}
        <h1 className="text-center text-[22px] font-bold text-white leading-tight">
          Establecer
          <br />
          nueva contraseña
        </h1>

        <p className="mt-2 text-center text-xs text-[#A8A8AA] leading-relaxed">
          Ingresá tus credenciales para acceder a tu cuenta.
        </p>

        {isSuccess ? (
          <div className="mt-6 rounded-[6px] bg-green-500/10 p-4 text-center text-xs text-green-400">
            <p className="font-semibold">¡Contraseña actualizada con éxito!</p>
            <p className="mt-1 text-[#A8A8AA]">Redirigiendo al inicio de sesión...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-6 flex flex-col gap-4"
          >
            <Input
              id="password"
              label="Nueva contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              id="confirmPassword"
              label="Confirmar contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {serverError && (
              <p
                role="alert"
                className="rounded-[6px] bg-red-500/10 px-3 py-2 text-xs text-red-400"
              >
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="mt-1 font-semibold"
            >
              Restablecer contraseña
            </Button>
          </form>
        )}

        <AuthDivider />

        <div className="text-center text-xs text-[#A8A8AA]">
          <span>¿Prefieres volver? </span>
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-white underline hover:text-[#FD7B03] transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </AuthCenteredCard>
  );
}