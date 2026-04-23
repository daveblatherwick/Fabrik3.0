import {
  createChart,
  AreaSeries,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import styles from "./ChartWithSummary.module.css";
import { CurrencyTile, type CurrencyTileProps } from "../CurrencyTile/CurrencyTile";

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1D";

export interface ChartPoint {
  time: number;   // Unix seconds
  value: number;
}

export interface ChartWithSummaryProps {
  /** Product symbol displayed top-left, e.g. "BTC/USD" */
  symbol: string;
  /** Longer label underneath the symbol, e.g. "Bitcoin" */
  productName?: string;
  /** Data series for the chart (time ascending) */
  data: ChartPoint[];
  /** Active timeframe */
  timeframe?: Timeframe;
  onTimeframeChange?: (tf: Timeframe) => void;
  /** OHLCV-style metric strip above the chart */
  metrics?: Array<{ label: string; value: ReactNode; trend?: "up" | "down" }>;
  /** Currency tiles shown in the right column */
  tiles?: CurrencyTileProps[];
  className?: string;
}

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1D"];

const TOOL_ICONS: Array<{ d: string; label: string }> = [
  { d: "M4 2v12M12 2v12", label: "Cursor" },
  { d: "M3 13l4-8 3 5 3-2", label: "Brush" },
  { d: "M3 4h10M3 8h10M3 12h10", label: "Text" },
  { d: "M2 12l10-10M6 2h6v6", label: "Measure" },
  { d: "M7 2a5 5 0 100 10 5 5 0 000-10zm4 9l3 3", label: "Zoom" },
  { d: "M2 8l4-4 4 4 4-4", label: "Path" },
  { d: "M3 7h10v6H3zM5 7V5a3 3 0 016 0", label: "Lock" },
  { d: "M1 8s2-5 7-5 7 5 7 5-2 5-7 5-7-5-7-5zm7 2a2 2 0 100-4 2 2 0 000 4z", label: "Visibility" },
];

export function ChartWithSummary({
  symbol,
  productName,
  data,
  timeframe = "1D",
  onTimeframeChange,
  metrics = [],
  tiles = [],
  className,
}: ChartWithSummaryProps) {
  const [tf, setTf] = useState<Timeframe>(timeframe);
  const effectiveTf = onTimeframeChange ? timeframe : tf;

  const chartContainer = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  // Derive CSS variable values (for the chart's own pixel-painted chrome)
  const themeVars = useMemo(() => {
    if (typeof window === "undefined") return null;
    const cs = getComputedStyle(document.documentElement);
    return {
      bg: cs.getPropertyValue("--fabric-chart-bg").trim() || "#141414",
      axis: cs.getPropertyValue("--fabric-chart-axis").trim() || "#a3a3a3",
      grid: cs.getPropertyValue("--fabric-chart-grid").trim() || "rgba(255,255,255,0.06)",
      line: cs.getPropertyValue("--fabric-chart-area-line").trim() || "#8184f8",
      areaTop: cs.getPropertyValue("--fabric-chart-area-top").trim() || "rgba(129,132,248,0.4)",
      areaBottom: cs.getPropertyValue("--fabric-chart-area-bottom").trim() || "rgba(129,132,248,0.02)",
    };
  }, []);

  // Create chart
  useEffect(() => {
    if (!chartContainer.current || !themeVars) return;

    const chart = createChart(chartContainer.current, {
      autoSize: true,
      layout: {
        background: { color: themeVars.bg },
        textColor: themeVars.axis,
        fontFamily: "Work Sans, system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: themeVars.grid },
        horzLines: { color: themeVars.grid },
      },
      rightPriceScale: { borderColor: themeVars.grid },
      timeScale: { borderColor: themeVars.grid, timeVisible: true, secondsVisible: false },
      crosshair: { mode: 1 },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: themeVars.line,
      topColor: themeVars.areaTop,
      bottomColor: themeVars.areaBottom,
      lineWidth: 2,
      priceLineVisible: true,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [themeVars]);

  // Update data
  useEffect(() => {
    if (!seriesRef.current) return;
    seriesRef.current.setData(
      data.map((p) => ({ time: p.time as Time, value: p.value })),
    );
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      <div className={styles.header}>
        <div className={styles.product}>
          <span className={styles.productIcon} aria-hidden="true">
            {symbol.split("/")[0].slice(0, 1)}
          </span>
          <span className={styles.productMeta}>
            <span className={styles.productSymbol}>{symbol}</span>
            {productName && <span className={styles.productName}>{productName}</span>}
          </span>
        </div>
        <div className={styles.metrics}>
          {metrics.map((m, i) => (
            <div key={i} className={styles.metric}>
              <span className={styles.metricLabel}>{m.label}</span>
              <span
                className={`${styles.metricValue} ${
                  m.trend === "up" ? styles.up : m.trend === "down" ? styles.down : ""
                }`}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.tools}>
          {TOOL_ICONS.map((icon) => (
            <button
              key={icon.label}
              type="button"
              className={styles.toolButton}
              aria-label={icon.label}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d={icon.d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>
          ))}
        </div>

        <div className={styles.chartColumn}>
          <div className={styles.timeframes} role="tablist" aria-label="Chart timeframe">
            {TIMEFRAMES.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={t === effectiveTf}
                className={`${styles.tf} ${t === effectiveTf ? styles.active : ""}`}
                onClick={() => {
                  if (onTimeframeChange) onTimeframeChange(t);
                  else setTf(t);
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className={styles.chart} ref={chartContainer}>
            {data.length === 0 && <div className={styles.chartLoading}>Loading chart…</div>}
          </div>
        </div>

        <div className={styles.tiles}>
          {tiles.map((tile, i) => (
            <CurrencyTile key={`${tile.symbol}-${i}`} {...tile} />
          ))}
        </div>
      </div>
    </div>
  );
}
