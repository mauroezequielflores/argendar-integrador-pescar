import LineChart from "../../../components/ui/LineChart";

/**
 * MarketplaceActivityCard — Panel de Actividad de Marketplace (CA03).
 *
 * Muestra el gráfico de evolución del volumen diario de operaciones en el tiempo.
 *
 * @param {object} props
 * @param {Array<{x: number|string, y: number}>} [props.data] - Puntos de datos para el gráfico
 * @param {boolean} [props.isLoading=false] - Estado de carga
 */
export default function MarketplaceActivityCard({ data = [], isLoading = false }) {
  return (
    <div className="flex flex-col gap-1 rounded-[6px] border border-[#323232] bg-[#292929] p-5 sm:p-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-sm sm:text-base font-bold text-white">
          Actividad de Marketplace
        </h2>
        <p className="mt-0.5 text-xs text-[#A8A8AA]">
          Volumen diario de operaciones
        </p>
      </div>

      {/* Gráfico */}
      <div className="mt-2 w-full">
        <LineChart
          data={data}
          yAxisTicks={[800, 600, 400, 200, 0]}
          xAxisTicks={[0, 5, 10, 15, 20, 25, 30]}
          maxY={850}
          minY={0}
        />
      </div>
    </div>
  );
}
