import styles from "./CurrencyTile.module.css";

export interface CurrencyTileProps {
  symbol: string;            // e.g. "EUR/USD"
  spotLabel?: string;        // e.g. "Spot (09 Nov)"
  low?: number;
  high?: number;
  sell: number;
  buy: number;
  /** Decimal pip spread marker (e.g. 2.2) */
  spreadPips?: number;
  quantity: number;
  /** Decimal places to display for prices */
  priceDecimals?: number;
  onSell?: () => void;
  onBuy?: () => void;
  className?: string;
}

const fmt = (n: number | undefined, dp: number) =>
  n == null
    ? "—"
    : n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

const fmtQty = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export function CurrencyTile({
  symbol,
  spotLabel = "Spot",
  low,
  high,
  sell,
  buy,
  spreadPips,
  quantity,
  priceDecimals = 5,
  onSell,
  onBuy,
  className,
}: CurrencyTileProps) {
  const [base] = symbol.split("/");
  return (
    <div className={`${styles.root} ${className ?? ""}`} role="group" aria-label={`${symbol} quote`}>
      <div className={styles.header}>
        <span className={styles.symbol}>{symbol}</span>
        <span className={styles.spot}>{spotLabel}</span>
      </div>
      <div className={styles.range}>
        <span>L {fmt(low, priceDecimals)}</span>
        <span>H {fmt(high, priceDecimals)}</span>
      </div>
      <div className={styles.prices}>
        <button type="button" className={styles.side} onClick={onSell} aria-label={`Sell ${base}`}>
          <span className={styles.sideLabel}>SELL {base}</span>
          <span className={styles.sidePrice}>{fmt(sell, priceDecimals)}</span>
          {spreadPips != null && <span className={styles.sideBadge}>{spreadPips.toFixed(1)}</span>}
        </button>
        <button type="button" className={styles.side} onClick={onBuy} aria-label={`Buy ${base}`}>
          <span className={styles.sideLabel}>BUY {base}</span>
          <span className={styles.sidePrice}>{fmt(buy, priceDecimals)}</span>
        </button>
      </div>
      <div className={styles.footer}>
        <span className={styles.qtyLabel}>Qty {base}</span>
        <span className={styles.qty}>{fmtQty(quantity)}</span>
      </div>
    </div>
  );
}
