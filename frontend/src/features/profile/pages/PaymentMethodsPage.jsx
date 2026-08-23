import { useNavigate } from "react-router-dom";
import { CreditCardIcon } from "@heroicons/react/24/outline";

import Card from "../../../components/ui/Card";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import EmptyState from "../../../components/ui/EmptyState";

export default function PaymentMethodsPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Mi perfil", path: "/client/profile" },
          { label: "Métodos de pago" },
        ]}
      />

      <Card className="flex flex-col border border-[#3a3a3a] bg-[#202020] p-0">
        {/* Cabecera */}
        <div className="p-6 md:p-8 border-b border-[#3a3a3a]">
          <h1 className="text-[24px] md:text-[28px] font-bold text-white mb-2">
            Métodos de pago
          </h1>
          <p className="text-sm md:text-base text-[#A8A8AA]">
            Administrá tus métodos de pago guardados en la plataforma.
          </p>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-col p-6 md:p-8">
          <div className="mb-4">
            <h2 className="text-[18px] font-semibold text-white mb-1">
              Tarjetas guardadas:
            </h2>
            <p className="text-sm text-[#A8A8AA]">
              Aquí recibirás el pago de tus servicios.
            </p>
          </div>

          {/* Bloque de Estado Vacío */}
          <div className="overflow-hidden rounded-md border border-[#3a3a3a] bg-[#292929]">
            <EmptyState
              icon={CreditCardIcon}
              title="No tienes tarjetas guardadas"
              description="Agrega una tarjeta para gestionar tus pagos de forma segura."
            />
          </div>

          {/* Acción de agregar tarjeta */}
          <button
            type="button"
            className="mt-6 w-full rounded-md bg-[#F78736] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e0772c]"
          >
            Agregar una nueva Tarjeta
          </button>
        </div>

        {/* Footer (Botones) */}
        <div className="mt-auto flex items-center justify-between border-t border-[#3a3a3a] p-6 md:p-8">
          <button
            type="button"
            onClick={() => navigate("/client/profile")}
            className="flex items-center gap-2 rounded-md border border-[#3a3a3a] bg-[#292929] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
          >
            <span aria-hidden="true">&larr;</span> Volver
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/client/profile")}
            className="rounded-md border border-[#3a3a3a] bg-[#292929] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
          >
            Cancelar
          </button>
        </div>
      </Card>
    </div>
  );
}
