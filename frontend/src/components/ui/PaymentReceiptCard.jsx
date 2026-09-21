/**
 * PaymentReceiptCard — Tarjeta reutilizable de comprobante / resumen de pago.
 *
 * Muestra el estado de la transacción, número de operación, método de pago,
 * fecha y monto pagado con el diseño estandarizado de Argendar.
 *
 * @param {object} props
 * @param {string} props.status - Estado del pago (ej. "CONFIRMADO")
 * @param {string} props.operationNumber - Identificador único de transacción (ej. "#MP-982341")
 * @param {string} props.paymentMethod - Medio de pago (ej. "Mercado Pago")
 * @param {string} props.date - Fecha del pago (ej. "12 Mayo, 2026")
 * @param {string} props.amount - Monto pagado formateado (ej. "$3.500,00")
 */
export default function PaymentReceiptCard({
  status = "CONFIRMADO",
  operationNumber = "",
  paymentMethod = "",
  date = "",
  amount = "",
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[6px] border border-[#323232] bg-[#292929] p-5">
      {/* Fila: Estado */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#A8A8AA]">
          ESTADO
        </span>
        <span className="rounded-[4px] bg-white px-2.5 py-0.5 text-xs font-bold uppercase text-[#202020]">
          {status}
        </span>
      </div>

      {/* Fila: Nº de Operación */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="text-[#A8A8AA]">Nº de Operación</span>
        <span className="font-medium text-white">{operationNumber}</span>
      </div>

      {/* Fila: Método */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="text-[#A8A8AA]">Método</span>
        <span className="font-medium text-white">{paymentMethod}</span>
      </div>

      {/* Fila: Fecha */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="text-[#A8A8AA]">Fecha</span>
        <span className="font-medium text-white">{date}</span>
      </div>

      {/* Fila: Monto Pagado */}
      <div className="flex items-center justify-between border-t border-[#323232] pt-4 text-xs sm:text-sm">
        <span className="font-bold text-[#A8A8AA]">Monto Pagado</span>
        <span className="text-base sm:text-lg font-bold text-white">{amount}</span>
      </div>
    </div>
  );
}
