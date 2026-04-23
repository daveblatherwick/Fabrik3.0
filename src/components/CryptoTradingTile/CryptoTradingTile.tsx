import { useMemo, useState, type ChangeEvent } from "react";
import styles from "./CryptoTradingTile.module.css";
import { InputField } from "../InputField/InputField";

export type MarketState = "open" | "auction" | "halted" | "closed" | "noMarket";
export type TileLayout = "collapsed" | "marketDepth" | "limitOrderEntry" | "combined";
export type TradeSide = "bid" | "offer";
export type OrderType = "limit" | "stop" | "fiat" | "done" | "cancelled" | "filter";

export interface DepthLevel {
  price: number;
  size: number;
}

export interface LimitOrderPayload {
  side: TradeSide;
  orderType: OrderType;
  quantity: number;
  asset: string;
  limitPrice: number;
  tif: string;
  sellAmountMode?: "Fixed Amount" | "Percent";
}

export interface CryptoTradingTileProps {
  symbol: string;                    // "BTCUSD"
  asset?: string;                    // "BTC" — derived from symbol if omitted
  state?: MarketState;
  layout?: TileLayout;
  activeSide?: TradeSide | null;
  onActiveSideChange?: (side: TradeSide | null) => void;
  quantity?: number;
  onQuantityChange?: (q: number) => void;

  bidPrice: number;                  // SELL side (left)
  bidDelta?: number;                 // small price delta label
  bidSize?: number;
  offerPrice: number;                // BUY side (right)
  offerDelta?: number;

  low?: number;
  high?: number;
  priceDecimals?: number;

  /** For marketDepth / combined layouts */
  depthBids?: DepthLevel[];
  depthAsks?: DepthLevel[];

  onSubmitOrder?: (order: LimitOrderPayload) => void;
  className?: string;
}

const fmtPrice = (n: number, dp: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

const fmtSmall = (n: number | undefined) =>
  n == null ? "" : n.toFixed(2);

export function CryptoTradingTile({
  symbol,
  asset,
  state = "open",
  layout = "collapsed",
  activeSide,
  onActiveSideChange,
  quantity = 1,
  onQuantityChange,
  bidPrice,
  bidDelta,
  bidSize,
  offerPrice,
  offerDelta,
  low,
  high,
  priceDecimals = 2,
  depthBids = [],
  depthAsks = [],
  onSubmitOrder,
  className,
}: CryptoTradingTileProps) {
  const [internalSide, setInternalSide] = useState<TradeSide | null>(null);
  const effectiveSide = activeSide !== undefined ? activeSide : internalSide;

  const setSide = (s: TradeSide | null) => {
    if (onActiveSideChange) onActiveSideChange(s);
    if (activeSide === undefined) setInternalSide(s);
  };

  const derivedAsset = asset ?? symbol.slice(0, 3);
  const disabled = state === "halted" || state === "closed";
  const showPrices = state !== "noMarket";
  const resolvedLayout: TileLayout = effectiveSide ? "limitOrderEntry" : layout;

  const statusLabel: string | null = useMemo(() => {
    switch (state) {
      case "auction": return "Auction";
      case "halted": return "Halted";
      case "closed": return "Closed";
      default: return null;
    }
  }, [state]);

  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      <div className={styles.header}>
        <span className={styles.headerCell}>
          Qty (000)
          <input
            type="number"
            className={styles.headerInput}
            value={quantity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onQuantityChange?.(Number(e.target.value))}
            aria-label="Quantity in thousands"
          />
        </span>
        <span className={styles.headerCell}>
          <span className={styles.symbol}>{symbol}</span>
          <span className={styles.search} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
        </span>
      </div>

      {(low != null || high != null) && (
        <div className={styles.rangeStrip}>
          <span>L {low != null ? fmtPrice(low, priceDecimals) : "—"}</span>
          <span>H {high != null ? fmtPrice(high, priceDecimals) : "—"}</span>
        </div>
      )}

      <div className={styles.quote}>
        <button
          type="button"
          className={`${styles.side} ${styles.sellSide} ${effectiveSide === "bid" ? styles.active : ""}`}
          disabled={disabled}
          onClick={() => setSide(effectiveSide === "bid" ? null : "bid")}
          aria-label={`Place bid on ${symbol}`}
        >
          <span className={styles.sideLabel}>SELL {derivedAsset}</span>
          {showPrices ? (
            <>
              <span className={styles.sidePrice}>{fmtPrice(bidPrice, priceDecimals)}</span>
              {bidDelta != null && <span className={styles.sideDelta}>{fmtSmall(bidDelta)}</span>}
            </>
          ) : (
            <span className={styles.noMarket}>No Market</span>
          )}
        </button>

        <div className={styles.spreadBadge}>
          {statusLabel ? (
            <span className={`${styles.statusPill} ${styles[`status-${state}`]}`}>{statusLabel}</span>
          ) : bidSize != null ? (
            <span>{fmtSmall(bidSize)}</span>
          ) : null}
        </div>

        <button
          type="button"
          className={`${styles.side} ${styles.buySide} ${effectiveSide === "offer" ? styles.active : ""}`}
          disabled={disabled}
          onClick={() => setSide(effectiveSide === "offer" ? null : "offer")}
          aria-label={`Place offer on ${symbol}`}
        >
          <span className={styles.sideLabel}>BUY {derivedAsset}</span>
          {showPrices ? (
            <>
              <span className={styles.sidePrice}>{fmtPrice(offerPrice, priceDecimals)}</span>
              {offerDelta != null && <span className={styles.sideDelta}>{fmtSmall(offerDelta)}</span>}
            </>
          ) : (
            <span className={styles.noMarket}>No Market</span>
          )}
        </button>
      </div>

      {(resolvedLayout === "marketDepth" || resolvedLayout === "combined") && (
        <MarketDepth
          bids={depthBids}
          asks={depthAsks}
          priceDecimals={priceDecimals}
        />
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.placeBtn} ${styles.bid} ${effectiveSide === "bid" ? styles.active : ""}`}
          disabled={disabled}
          onClick={() => setSide(effectiveSide === "bid" ? null : "bid")}
        >
          Place Bid
        </button>
        <div className={styles.divider} />
        <button
          type="button"
          className={`${styles.placeBtn} ${styles.offer} ${effectiveSide === "offer" ? styles.active : ""}`}
          disabled={disabled}
          onClick={() => setSide(effectiveSide === "offer" ? null : "offer")}
        >
          Place Offer
        </button>
      </div>

      {effectiveSide && (
        <OrderForm
          side={effectiveSide}
          symbol={symbol}
          asset={derivedAsset}
          defaultPrice={effectiveSide === "bid" ? bidPrice : offerPrice}
          priceDecimals={priceDecimals}
          onCancel={() => setSide(null)}
          onSubmit={(payload) => {
            onSubmitOrder?.(payload);
            setSide(null);
          }}
        />
      )}
    </div>
  );
}

function MarketDepth({
  bids,
  asks,
  priceDecimals,
}: {
  bids: DepthLevel[];
  asks: DepthLevel[];
  priceDecimals: number;
}) {
  return (
    <div className={styles.depth}>
      <div className={styles.depthGrid} role="table" aria-label="Market depth">
        {Array.from({ length: Math.max(bids.length, asks.length) }).map((_, i) => {
          const b = bids[i];
          const a = asks[i];
          return (
            <div key={i} style={{ display: "contents" }} role="row">
              <span className={`${styles.depthCell} ${styles.size}`}>
                {b ? fmtSmall(b.size) : ""}
              </span>
              <span className={`${styles.depthCell} ${styles.bid}`}>
                {b ? fmtPrice(b.price, priceDecimals) : ""}
              </span>
              <span className={`${styles.depthCell} ${styles.ask} ${styles.right}`}>
                {a ? fmtPrice(a.price, priceDecimals) : ""}
              </span>
              <span className={`${styles.depthCell} ${styles.size} ${styles.right}`}>
                {a ? fmtSmall(a.size) : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderForm({
  side,
  symbol,
  asset,
  defaultPrice,
  priceDecimals,
  onCancel,
  onSubmit,
}: {
  side: TradeSide;
  symbol: string;
  asset: string;
  defaultPrice: number;
  priceDecimals: number;
  onCancel: () => void;
  onSubmit: (payload: LimitOrderPayload) => void;
}) {
  const [orderType, setOrderType] = useState<OrderType>("limit");
  const [quantity, setQuantity] = useState<string>("");
  const [limitPrice, setLimitPrice] = useState<string>(defaultPrice.toFixed(priceDecimals + 1));
  const [tif, setTif] = useState("FOK - Fill or Kill");
  const submitLabel = `${side === "bid" ? "Sell" : "Buy"} ${symbol} @ LMT`;

  return (
    <div className={styles.orderForm}>
      <div className={styles.orderTabs} role="tablist">
        {(["limit", "stop", "fiat", "done", "cancelled", "filter"] as OrderType[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={orderType === t}
            className={`${styles.orderTab} ${orderType === t ? styles.activeTab : ""}`}
            onClick={() => setOrderType(t)}
          >
            {t.slice(0, 1).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {side === "offer" && (
        <div className={`${styles.formGrid} ${styles.single}`}>
          <InputField
            label="Sell"
            value="Fixed Amount"
            readOnly
          />
        </div>
      )}

      <div className={styles.formGrid}>
        <InputField
          label="Quantity"
          placeholder="Add qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <InputField label="Asset" value={asset} readOnly />
      </div>

      <div className={`${styles.formGrid} ${styles.single}`}>
        <InputField
          label="Limit Price"
          value={limitPrice}
          onChange={(e) => setLimitPrice(e.target.value)}
          leadingIcon={<span>@</span>}
        />
      </div>

      <div className={`${styles.formGrid} ${styles.single}`}>
        <InputField
          label="Time in Force"
          value={tif}
          onChange={(e) => setTif(e.target.value)}
        />
      </div>

      <div className={styles.orderActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={`${styles.submitBtn} ${side === "bid" ? styles.bid : styles.offer}`}
          onClick={() =>
            onSubmit({
              side,
              orderType,
              quantity: Number(quantity) || 0,
              asset,
              limitPrice: Number(limitPrice) || 0,
              tif,
            })
          }
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
