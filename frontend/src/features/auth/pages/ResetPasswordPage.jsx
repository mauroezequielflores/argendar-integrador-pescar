
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyIcon, PaperAirplaneIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

import { resetPasswordRequestSchema } from "../../../validations/resetPassword.schema";
import { requestPasswordReset, resendPasswordReset } from "../services/auth.service";
import { ROUTES } from "../../../constants/routes";

import AuthCenteredCard from "../components/AuthCenteredCard";
import AuthHeaderBadge from "../components/AuthHeaderBadge";
import AuthDivider from "../components/AuthDivider";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

/**
 * ResetPasswordPage — Pantalla para solicitud de recuperación de contraseña.
 *
 * Flujo:
 *  - Paso 1: Formulario "Recuperar contraseña" (ingreso de correo).
 *  - Paso 2: Pantalla de confirmación "Correo enviado" con acción de reenvío y botón "Entendido".
 *
 * Ruta: /reset-password
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Permite forzar el estado "sent" mediante query param ?step=sent para pruebas visuales directas
  const initialStep = searchParams.get("step") === "sent" ? "sent" : "request";
  const [step, setStep] = useState(initialStep);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);
    try {
      await requestPasswordReset({ email: data.email });
      setSubmittedEmail(data.email);
      setStep("sent");
    } catch (error) {
      setServerError(error.message || "Ocurrió un error al procesar tu solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setServerError("");
    setFeedbackMessage("");
    setIsResending(true);
    try {
      const res = await resendPasswordReset({ email: submittedEmail });
      setFeedbackMessage(res.message || "Enlace reenviado.");
    } catch (error) {
      setServerError(error.message || "Error al reenviar el correo.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCenteredCard>
      {step === "request" ? (
        /* ─── Paso 1: Recuperar contraseña ─── */
        <div className="flex flex-col">
          <AuthHeaderBadge icon={KeyIcon} />

          <h1 className="text-center text-[22px] font-bold text-white leading-tight">
            Recuperar contraseña
          </h1>

          <p className="mt-1.5 text-center text-xs text-[#A8A8AA] leading-relaxed">
            Ingresa tu correo electrónico para recibir las instrucciones de recuperación
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-6 flex flex-col gap-4"
          >
            <Input
              id="email"
              label="Correo electrónico"
              type="email"
              placeholder="Ingresa tu correo electronico"
              error={errors.email?.message}
              {...register("email")}
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
              Enviar instrucciones
            </Button>
          </form>

          <AuthDivider />

          <div className="text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#FD7B03] hover:text-[#e06d00] transition-colors"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Volver al inicio de sesión</span>
            </Link>
          </div>
        </div>
      ) : (
        /* ─── Paso 2: Correo enviado ─── */
        <div className="flex flex-col">
          <AuthHeaderBadge icon={PaperAirplaneIcon} />

          <h1 className="text-center text-[22px] font-bold text-white leading-tight">
            Correo enviado
          </h1>

          <p className="mt-2 text-center text-xs text-[#A8A8AA] leading-relaxed px-1">
            Hemos enviado un enlace de recuperación a tu correo electrónico. Por
            favor, revisa tu bandeja de entrada.
          </p>

          {feedbackMessage && (
            <p
              role="status"
              className="mt-4 rounded-[6px] bg-green-500/10 px-3 py-2 text-center text-xs text-green-400"
            >
              {feedbackMessage}
            </p>
          )}

          {serverError && (
            <p
              role="alert"
              className="mt-4 rounded-[6px] bg-red-500/10 px-3 py-2 text-center text-xs text-red-400"
            >
              {serverError}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="font-semibold"
            >
              Entendido
            </Button>
          </div>

          <AuthDivider />

          <div className="text-center text-xs text-[#A8A8AA]">
            <span>¿No recibiste el correo? </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-white underline hover:text-[#FD7B03] transition-colors disabled:opacity-50"
            >
              {isResending ? "Reenviando..." : "Reenviar enlace"}
            </button>
          </div>
        </div>
      )}
    </AuthCenteredCard>
  );
}