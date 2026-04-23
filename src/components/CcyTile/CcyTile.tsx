import { useMemo, useState, type ChangeEvent } from "react";
import styles from "./CcyTile.module.css";

export interface CcyTileProps {
  /** Currency pair, e.g. "EUR/USD" */
  pair: string;
  /** Reference/spot date label — "Spot (09 Nov)" */
  spotLabel?: string;

  sell: number;
  buy: number;
  /** Spread in pips (appears in centre column) */
  spreadPips?: number;
  /** true = green arrow, false = red arrow */
  trendingUp?: boolean;
  /** day low / high */
  low?: number;
  high?: number;

  quantity?: number;
  onQuantityChange?: (q: number) => void;
  /** If true, the ccy pair is editable via <input>; otherwise renders as a label. */
  editablePair?: boolean;
  onPairChange?: (p: string) => void;

  /** Sparkline points — 0..1 normalised values */
  sparkline?: number[];

  /** Visual flags from Figma variants */
  brand?: boolean;          // show top brand strip
  restyle?: boolean;        // alternate surface bg
  minimal?: boolean;        // MVP=true layout — drop info strip / footer

  priceDecimals?: number;
  onSell?: () => void;
  onBuy?: () => void;
  className?: string;
}

const fmt = (n: number | undefined, dp: number) =>
  n == null
    ? "—"
    : n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

export function CcyTile({
  pair,
  spotLabel = "Spot",
  sell,
  buy,
  spreadPips,
  trendingUp = true,
  low,
  high,
  quantity = 1_000_000,
  onQuantityChange,
  editablePair = false,
  onPairChange,
  sparkline,
  brand = false,
  restyle = false,
  minimal = false,
  priceDecimals = 5,
  onSell,
  onBuy,
  className,
}: CcyTileProps) {
  const [base] = pair.split("/");
  const sparkPath = useMemo(() => buildSparkPath(sparkline, 236, 32), [sparkline]);

  return (
    <div className={`${styles.root} ${restyle ? styles.restyle : ""} ${className ?? ""}`}>
      {brand && <div className={styles.brandStrip} aria-hidden="true" />}

      <div className={styles.header}>
        <span className={styles.headerField}>
          Qty
          <input
            type="number"
            className={styles.headerInput}
            value={quantity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onQuantityChange?.(Number(e.target.value))}
            aria-label="Quantity"
          />
        </span>
        <span className={styles.headerField}>
          {editablePair ? (
            <input
              className={styles.headerInput}
              value={pair}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onPairChange?.(e.target.value)}
              aria-label="Currency pair"
            />
          ) : (
            <span className={styles.ccyLabel}>{pair}</span>
          )}
        </span>
      </div>

      {!minimal && (
        <div className={styles.infoStrip}>
          <span className={styles.pillGroup}>
            <span className={styles.pill}>{base}</span>
            <span className={styles.pill}>{spotLabel}</span>
          </span>
          {(low != null || high != null) && (
            <span className={styles.range}>
              <span>L {fmt(low, priceDecimals)}</span>
              <span>H {fmt(high, priceDecimals)}</span>
            </span>
          )}
        </div>
      )}

      <div className={styles.quote}>
        <button
          type="button"
          className={`${styles.side} ${styles.sell}`}
          onClick={onSell}
          aria-label={`Sell ${base}`}
        >
          <span className={styles.sideLabel}>SELL {base}</span>
          <span className={styles.sidePrice}>{fmt(sell, priceDecimals)}</span>
        </button>

        <div className={styles.spreadColumn}>
          <span className={`${styles.trendArrow} ${trendingUp ? "" : styles.down}`} aria-hidden="true">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M5 0L9.33 7.5H0.67L5 0Z" fill="currentColor" />
            </svg>
          </span>
          {spreadPips != null && <span className={styles.spreadValue}>{spreadPips.toFixed(1)}</span>}
        </div>

        <button
          type="button"
          className={`${styles.side} ${styles.buy}`}
          onClick={onBuy}
          aria-label={`Buy ${base}`}
        >
          <span className={styles.sideLabel}>BUY {base}</span>
          <span className={styles.sidePrice}>{fmt(buy, priceDecimals)}</span>
        </button>
      </div>

      {sparkline && sparkline.length > 1 && (
        <div className={styles.chartRow}>
          <svg className={styles.chart} viewBox="0 0 236 32" preserveAspectRatio="none">
            <path d={sparkPath.area} fill="var(--fabric-ccytile-up)" fillOpacity="0.12" />
            <path d={sparkPath.line} stroke="var(--fabric-ccytile-up)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {!minimal && (
        <div className={styles.actions}>
          <button type="button" className={styles.actionChip}>Split</button>
          <span className={styles.footerCenter}>
            <button type="button" className={styles.actionChip} aria-label="Edit">✎</button>
            <span>{pair}</span>
            <button type="button" className={styles.actionChip} aria-label="Settings">⋯</button>
          </span>
          <button type="button" className={styles.actionChip}>Send</button>
        </div>
      )}
    </div>
  );
}

function buildSparkPath(points: number[] | undefined, w: number, h: number) {
  if (!points || points.length < 2) return { line: "", area: "" };
  const lo = Math.min(...points);
  const hi = Math.max(...points);
  const range = hi - lo || 1;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = h - ((p - lo) / range) * h;
    return [x, y] as const;
  });
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L${w.toFixed(2)},${h} L0,${h} Z`;
  return { line, area };
}
