import { useMemo } from "react";
import styles from "./DepthChart.module.css";

export interface DepthLevel {
  price: number;
  /** Cumulative amount at this price level */
  total: number;
}

export interface DepthChartProps {
  /** Ascending by price, cumulative totals */
  asks: DepthLevel[];
  /** Descending by price (best bid first), cumulative totals */
  bids: DepthLevel[];
  /** Overall component height. Width is fixed at 184px for the Figma-faithful layout. */
  height?: number;
  /** Three label stops along the Y axis, from top (highest volume) to bottom. */
  labels?: [string, string, string];
  className?: string;
}

/**
 * Builds an SVG area path. Closes back to the x=baselineX axis so the
 * area fills only between the curve and the chart's left edge.
 */
function areaPath(points: [number, number][], baselineX: number): string {
  if (points.length === 0) return "";
  const [, firstY] = points[0];
  const [, lastY] = points[points.length - 1];
  const line = points.map((p) => `${p[0]},${p[1]}`).join(" L");
  return `M${baselineX},${firstY} L${line} L${baselineX},${lastY} Z`;
}

export function DepthChart({
  asks,
  bids,
  height = 692,
  labels = ["72.45", "38.10", "19.85"],
  className,
}: DepthChartProps) {
  const width = 184;
  const chartX = 64; // left padding for axis labels
  const chartW = width - chartX;

  const { askPath, bidPath } = useMemo(() => {
    const maxTotal = Math.max(
      asks[asks.length - 1]?.total ?? 0,
      bids[bids.length - 1]?.total ?? 0,
      1,
    );

    const halfH = height / 2;
    // Asks: y grows from spread (bottom of top half) toward 0 (top)
    //       x grows from 0 (spread) to chartW (max volume)
    const askPoints: [number, number][] = asks.map((lvl, i) => {
      const x = chartX + (lvl.total / maxTotal) * chartW;
      const y = halfH - (i / Math.max(asks.length - 1, 1)) * halfH;
      return [x, y];
    });
    // Bids mirror: y grows from spread (top of bottom half) toward height
    const bidPoints: [number, number][] = bids.map((lvl, i) => {
      const x = chartX + (lvl.total / maxTotal) * chartW;
      const y = halfH + (i / Math.max(bids.length - 1, 1)) * halfH;
      return [x, y];
    });

    return {
      askPath: areaPath(askPoints, chartX),
      bidPath: areaPath(bidPoints, chartX),
    };
  }, [asks, bids, height, chartW]);

  // Three horizontal grid stops: 25%, 50%, 75% of height
  const stops = [0.18, 0.5, 0.72].map((p) => p * height);

  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      <div className={styles.header}>
        <span className={styles.title}>
          Depth Chart
          <svg className={styles.titleIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className={styles.headerActions}>
          <button type="button" className={styles.iconButton} aria-label="Sort direction">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className={styles.iconButton} aria-label="Export">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2.5V12.5M10 2.5L6.5 6M10 2.5L13.5 6M4 13V15C4 16.1 4.9 17 6 17H14C15.1 17 16 16.1 16 15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </span>
      </div>

      <div className={styles.body} style={{ height }}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Depth chart"
        >
          {/* Grid lines + labels */}
          {stops.map((y, i) => (
            <g key={`g-${i}`}>
              <line x1={chartX} y1={y} x2={width} y2={y} className={styles.grid} />
              <line x1={chartX - 4} y1={y} x2={chartX} y2={y} className={styles.gridTick} />
              <text x={chartX - 10} y={y + 4} textAnchor="end" className={styles.label}>
                {labels[i]}
              </text>
            </g>
          ))}

          {/* Area fills */}
          <path className={styles.askArea} d={askPath} />
          <path className={styles.bidArea} d={bidPath} />
        </svg>
      </div>
    </div>
  );
}
