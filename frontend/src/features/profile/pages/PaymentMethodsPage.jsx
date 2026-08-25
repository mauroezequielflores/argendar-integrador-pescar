import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon, WalletIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

/* ── Empty state — sin tarjetas ─────────────────────────────────── */
function EmptyCards() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-[#323232] px-6 py-14">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#323232]">
          <WalletIcon className="h-8 w-8 text-[#A8A8AA]" />
        </div>
        <ExclamationCircleIcon className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#292929] text-[#A8A8AA]" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-semibold text-white">No tienes tarjetas guardadas</p>
        <p className="text-xs text-[#A8A8AA]">
          Agrega una tarjeta para gestionar tus pagos de forma segura.
        </p>
      </div>
    </div>
  );
}

/* ── Pantalla principal ─────────────────────────────────────────── */
export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta el rol desde la URL actual (/professional | /client)
  // Si no matchea ninguno (ruta inesperada) → backPath apunta a raíz
  const match = location.pathname.match(/^\/(professional|client)/);
  const prefix = match ? `/${match[1]}` : null;
  const backPath = prefix ? `${prefix}/profile` : "/";

  /* Mock: array vacío = empty state, agregar objetos para probar con tarjetas */
  const tarjetas = [];

  return (
    <div className="flex w-full flex-col gap-4 p-6">
      {/* CA01 — Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#A8A8AA]">
        <span
          className="cursor-pointer transition-colors hover:text-white"
          onClick={() => navigate(backPath)}
        >
          Mi perfil
        </span>
        <span>›</span>
        <span className="font-medium text-white">Métodos de pago</span>
      </nav>

      {/* Contenedor principal */}
      <div className="rounded-lg border border-[#323232] bg-[#292929]">
        {/* Título */}
        <div className="border-b border-[#323232] p-6 pb-5">
          <h1 className="text-xl font-semibold text-white">Métodos de pago</h1>
          <p className="mt-1 text-xs text-[#A8A8AA]">
            Administrá tus métodos de pago guardados en la plataforma.
          </p>
        </div>

        {/* CA02 — Tarjetas guardadas */}
        <div className="flex flex-col gap-4 p-6">
          <div>
            <p className="text-sm font-semibold text-white">Tarjetas guardadas:</p>
            <p className="mt-0.5 text-xs text-[#A8A8AA]">
              Aquí recibirás el pago de tus servicios.
            </p>
          </div>

          {tarjetas.length === 0 ? (
            <EmptyCards />
          ) : (
            <div className="flex flex-col gap-3">
              {tarjetas.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-[#323232] px-5 py-4"
                >
                  <p className="text-sm text-white">{t.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* CA03 — Botón agregar tarjeta */}
          <button
            type="button"
            className="w-full rounded-md border border-[#323232] bg-transparent py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#323232]/40"
          >
            Agregar una nueva Tarjeta
          </button>
        </div>
      </div>

      {/* CA04 — Botones footer */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-2 rounded-md border border-[#727272] bg-transparent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#292929]"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Volver
        </button>
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-2 rounded-md border border-[#727272] bg-transparent px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#292929]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
