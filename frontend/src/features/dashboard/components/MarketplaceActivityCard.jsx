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
const TICK_COUNT = 4;
const NICE_STEPS = [1, 2, 5];

/** Eje Y adaptado al máximo real: 4 tramos con un paso "redondo" (1, 2, 5, 10, 20, 50…). */
function getYAxis(data) {
  const maxValue = Math.max(...data.map((point) => point.y), 0);
  let magnitude = 1;
  for (;;) {
    const step = NICE_STEPS.map((base) => base * magnitude).find(
      (candidate) => candidate * TICK_COUNT >= maxValue,
    );
    if (step) {
      const maxY = step * TICK_COUNT;
      return {
        maxY,
        ticks: Array.from({ length: TICK_COUNT + 1 }, (_, i) => maxY - i * step),
      };
    }
    magnitude *= 10;
  }
}

export default function MarketplaceActivityCard({ data = [], isLoading = false }) {
  const { maxY, ticks } = getYAxis(data);

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
          yAxisTicks={ticks}
          xAxisTicks={[0, 5, 10, 15, 20, 25, 30]}
          maxY={maxY}
          minY={0}
        />
      </div>
    </div>
  );
}
