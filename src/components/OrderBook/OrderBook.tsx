import { type CSSProperties } from "react";
import styles from "./OrderBook.module.css";

export interface OrderLevel {
  price: number;
  amount: number;
  /** Cumulative amount at this price level */
  total: number;
}

export interface OrderBookProps {
  /** Ascending by price — will be reversed for display (lowest ask at bottom) */
  asks: OrderLevel[];
  /** Descending by price — highest bid at top */
  bids: OrderLevel[];
  /** Last matched price */
  lastPrice: number;
  /** Base asset symbol (e.g. "BTC"). Used in column headers. */
  baseSymbol?: string;
  priceDecimals?: number;
  amountDecimals?: number;
  className?: string;
}

const fmt = (n: number, dp: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });

function Row({
  level,
  side,
  depth,
  priceDecimals,
  amountDecimals,
}: {
  level: OrderLevel;
  side: "ask" | "bid";
  depth: number;
  priceDecimals: number;
  amountDecimals: number;
}) {
  return (
    <div className={styles.row} style={{ ["--depth" as string]: `${depth}%` } as CSSProperties}>
      <span
        className={`${styles.depthBar} ${side === "ask" ? styles.depthAsk : styles.depthBid}`}
        aria-hidden="true"
      />
      <span className={`${styles.cell} ${side === "ask" ? styles.priceAsk : styles.priceBid}`}>
        {fmt(level.price, priceDecimals)}
      </span>
      <span className={`${styles.cell} ${styles.cellRight}`}>{fmt(level.amount, amountDecimals)}</span>
      <span className={`${styles.cell} ${styles.cellRight} ${styles.cellMuted}`}>
        {fmt(level.total, amountDecimals)}
      </span>
    </div>
  );
}

export function OrderBook({
  asks,
  bids,
  lastPrice,
  baseSymbol = "BTC",
  priceDecimals = 2,
  amountDecimals = 4,
  className,
}: OrderBookProps) {
  // Static depth pattern: largest bars at the outer edges, smallest near the spread.
  // Independent of data so the bars never reflow as prices update.
  const staticDepth = (index: number, count: number) => {
    if (count <= 1) return 100;
    const t = index / (count - 1); // 0..1 from spread-edge outward
    return 10 + t * 80; // 10% near spread → 90% at far edge
  };

  const bestAsk = asks[0]?.price ?? lastPrice;
  const bestBid = bids[0]?.price ?? lastPrice;
  const spread = bestAsk - bestBid;
  const spreadPct = bestBid > 0 ? (spread / bestBid) * 100 : 0;

  // Display asks high-to-low (so best ask sits adjacent to spread/last price below)
  const asksDisplay = [...asks].reverse();

  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      <div className={styles.header}>
        <span className={styles.title}>
          Order Book
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

      <div className={styles.body} role="table" aria-label="Order book">
        <div className={styles.tableHead} role="row">
          <span className={styles.thCell} role="columnheader">Price</span>
          <span className={`${styles.thCell} ${styles.thRight}`} role="columnheader">
            Amount ({baseSymbol})
          </span>
          <span className={`${styles.thCell} ${styles.thRight}`} role="columnheader">
            Total ({baseSymbol})
          </span>
        </div>

        {asksDisplay.map((lvl, i) => (
          <Row
            key={`a-${lvl.price}`}
            level={lvl}
            side="ask"
            depth={staticDepth(asksDisplay.length - 1 - i, asksDisplay.length)}
            priceDecimals={priceDecimals}
            amountDecimals={amountDecimals}
          />
        ))}

        <div className={styles.spread} role="row">
          <span className={styles.spreadLabel}>
            Last Matched Price
            <span>Current Spread</span>
          </span>
          <span className={styles.spreadPrice}>0.00000</span>
          <span className={styles.spreadLast}>
            {fmt(lastPrice, priceDecimals)}
            <span className={styles.spreadDelta}>
              {fmt(spread, priceDecimals)} ({spreadPct.toFixed(4)}%)
            </span>
          </span>
        </div>

        {bids.map((lvl, i) => (
          <Row
            key={`b-${lvl.price}`}
            level={lvl}
            side="bid"
            depth={staticDepth(i, bids.length)}
            priceDecimals={priceDecimals}
            amountDecimals={amountDecimals}
          />
        ))}
      </div>
    </div>
  );
}
