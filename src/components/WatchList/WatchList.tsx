import { useMemo, useState, type ChangeEvent } from "react";
import styles from "./WatchList.module.css";

export interface MarketRow {
  /** Market symbol e.g. "BTC/USD" */
  symbol: string;
  /** Last trade price */
  price: number;
  /** 24h quote-asset volume in absolute units (we format with B/M/K) */
  volume: number;
  /** 24h price change as a decimal, e.g. 1.72 for +1.72%, -0.94 for -0.94% */
  changePct: number;
  /** Optional display rounding for the price (auto-inferred if omitted) */
  priceDecimals?: number;
}

export interface WatchListProps {
  markets: MarketRow[];
  categories?: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  selectedSymbol?: string;
  onSelect?: (symbol: string) => void;
  searchPlaceholder?: string;
  /** Optional search-field query (uncontrolled if omitted) */
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  className?: string;
}

const DEFAULT_CATEGORIES = ["All", "BTC", "BCH", "ETH", "XRP", "EOS", "LTC"];

function compactVolume(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toFixed(0);
}

function formatPrice(price: number, explicit?: number): string {
  const dp =
    explicit ?? (price >= 1000 ? 2 : price >= 1 ? 3 : price >= 0.01 ? 4 : 6);
  return price.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

function formatChange(pct: number): string {
  const sign = pct >= 0 ? "+" : "−"; // U+2212 minus for typographic alignment
  return `${sign}${Math.abs(pct).toFixed(2)}%`;
}

export function WatchList({
  markets,
  categories = DEFAULT_CATEGORIES,
  activeCategory,
  onCategoryChange,
  selectedSymbol,
  onSelect,
  searchPlaceholder = "Search Markets",
  searchQuery,
  onSearchChange,
  className,
}: WatchListProps) {
  const [internalCategory, setInternalCategory] = useState(categories[0]);
  const [internalQuery, setInternalQuery] = useState("");
  const category = activeCategory ?? internalCategory;
  const query = searchQuery ?? internalQuery;

  const setCategory = (c: string) => {
    if (activeCategory === undefined) setInternalCategory(c);
    onCategoryChange?.(c);
  };

  const setQuery = (q: string) => {
    if (searchQuery === undefined) setInternalQuery(q);
    onSearchChange?.(q);
  };

  const filtered = useMemo(() => {
    let rows = markets;
    if (category && category !== "All") {
      rows = rows.filter((m) => m.symbol.split("/")[0] === category);
    }
    if (query.trim()) {
      const q = query.trim().toUpperCase();
      rows = rows.filter((m) => m.symbol.toUpperCase().includes(q));
    }
    return rows;
  }, [markets, category, query]);

  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      <div className={styles.header}>
        <span className={styles.title}>
          Markets
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

      <div className={styles.search}>
        <div className={styles.searchBox}>
          <input
            type="search"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className={styles.searchInput}
            aria-label="Search markets"
          />
          <span className={styles.searchIcon} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.tabs} role="tablist" aria-label="Market categories">
          <button type="button" className={`${styles.tab} ${styles.bookmarkTab}`} aria-label="Bookmarked markets">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 1.75h8v10.5L7 9.625 3 12.25V1.75Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={c === category}
              className={`${styles.tab} ${c === category ? styles.active : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className={styles.table} role="table" aria-label="Markets">
          <div className={styles.tableHead} role="row">
            <span className={styles.thCell} role="columnheader">Market</span>
            <span className={`${styles.thCell} ${styles.thRight}`} role="columnheader">Last Price</span>
            <span className={`${styles.thCell} ${styles.thRight}`} role="columnheader">Vol</span>
            <span className={`${styles.thCell} ${styles.thRight}`} role="columnheader">24h %</span>
          </div>

          {filtered.map((m) => {
            const selected = m.symbol === selectedSymbol;
            return (
              <button
                key={m.symbol}
                type="button"
                role="row"
                aria-selected={selected}
                className={`${styles.row} ${selected ? styles.selected : ""}`}
                onClick={() => onSelect?.(m.symbol)}
              >
                <span className={styles.cell}>{m.symbol}</span>
                <span className={`${styles.cell} ${styles.cellRight}`}>
                  {formatPrice(m.price, m.priceDecimals)}
                </span>
                <span className={`${styles.cell} ${styles.cellRight} ${styles.cellMuted}`}>
                  {compactVolume(m.volume)}
                </span>
                <span
                  className={`${styles.cell} ${styles.cellRight} ${
                    m.changePct >= 0 ? styles.changePos : styles.changeNeg
                  }`}
                >
                  {formatChange(m.changePct)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
