import { useMemo } from "react";

/**
 * LineChart — Gráfico de líneas puro en SVG, responsive y sin dependencias externas.
 *
 * @param {object} props
 * @param {Array<{x: number|string, y: number}>} props.data - Puntos de datos [{ x: 0, y: 450 }, { x: 5, y: 520 }, ...]
 * @param {number[]} [props.yAxisTicks] - Valores para las líneas y etiquetas del eje Y (ej. [800, 600, 400, 200, 0])
 * @param {Array<number|string>} [props.xAxisTicks] - Etiquetas del eje X (ej. [0, 5, 10, 15, 20, 25, 30])
 * @param {number} [props.maxY=800] - Valor máximo del eje Y
 * @param {number} [props.minY=0] - Valor mínimo del eje Y
 * @param {string} [props.lineColor="#FFFFFF"] - Color de la línea
 * @param {number} [props.height=220] - Altura del gráfico en px
 */
export default function LineChart({
  data = [],
  yAxisTicks = [800, 600, 400, 200, 0],
  xAxisTicks = [0, 5, 10, 15, 20, 25, 30],
  maxY = 800,
  minY = 0,
  lineColor = "#FFFFFF",
  height = 220,
}) {
  const width = 800;
  const svgHeight = 200;
  const paddingLeft = 0;
  const paddingRight = 0;
  const paddingTop = 15;
  const paddingBottom = 15;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Generar curva suave en SVG (Cardinal spline / bezier)
  const pathData = useMemo(() => {
    if (!data || data.length === 0) {
      // Línea plana en cero
      const yZero = paddingTop + chartHeight;
      return `M ${paddingLeft} ${yZero} L ${width - paddingRight} ${yZero}`;
    }

    const points = data.map((d, index) => {
      const x =
        paddingLeft +
        (index / Math.max(data.length - 1, 1)) * chartWidth;
      const normalizedY = Math.max(minY, Math.min(maxY, d.y));
      const y =
        paddingTop +
        chartHeight -
        ((normalizedY - minY) / (maxY - minY)) * chartHeight;
      return { x, y };
    });

    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    // Algoritmo de curva suave bezier cúbica
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    return d;
  }, [data, chartWidth, chartHeight, paddingLeft, paddingRight, paddingTop, maxY, minY, width]);

  return (
    <div className="flex flex-col w-full select-none">
      <div className="flex items-stretch w-full" style={{ height: `${height}px` }}>
        {/* Eje Y (Etiquetas a la izquierda) */}
        <div className="flex flex-col justify-between pr-3 text-right text-[11px] font-medium text-[#727272] select-none w-8 shrink-0">
          {yAxisTicks.map((tick) => (
            <span key={tick} className="leading-none">
              {tick}
            </span>
          ))}
        </div>

        {/* Área del Gráfico con Grid horizontal y Línea SVG */}
        <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
          {/* Líneas horizontales de cuadrícula */}
          {yAxisTicks.map((tick, idx) => (
            <div
              key={tick}
              className={`w-full border-b ${
                idx === yAxisTicks.length - 1
                  ? "border-[#323232]"
                  : "border-[#262626]"
              }`}
            />
          ))}

          {/* Curva SVG */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              viewBox={`0 0 ${width} ${svgHeight}`}
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <path
                d={pathData}
                fill="none"
                stroke={lineColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Eje X (Etiquetas inferiores) */}
      <div className="flex justify-between pl-8 pr-1 pt-2 text-[11px] text-[#727272] font-medium select-none">
        {xAxisTicks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  );
}
