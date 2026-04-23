import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { WatchList, type MarketRow } from "./WatchList";
import { fabricDocsPage } from "../../docs/FabricDocsPage";

const FALLBACK: MarketRow[] = [
  { symbol: "BTC/USD", price: 42_865.2, volume: 18.4e9, changePct: 1.72 },
  { symbol: "BTC/USDT", price: 42_872.1, volume: 22.1e9, changePct: 1.69 },
  { symbol: "BTC/USDC", price: 42_860.8, volume: 9.6e9, changePct: 1.74 },
  { symbol: "BTC/EUR", price: 39_420.5, volume: 7.3e9, changePct: 1.58 },
  { symbol: "BTC/GBP", price: 33_710.4, volume: 2.9e9, changePct: 1.41 },
  { symbol: "ETH/USD", price: 2_318.45, volume: 11.2e9, changePct: 2.14 },
  { symbol: "ETH/USDC", price: 2_317.9, volume: 6.4e9, changePct: 2.09 },
  { symbol: "ETH/EUR", price: 2_135.6, volume: 4.9e9, changePct: 1.97 },
  { symbol: "ETH/BTC", price: 0.0541, volume: 3.1e9, changePct: 0.42 },
  { symbol: "SOL/USD", price: 98.72, volume: 4.3e9, changePct: 3.86 },
  { symbol: "XRP/USD", price: 0.623, volume: 2.8e9, changePct: -0.94 },
  { symbol: "XRP/EUR", price: 0.573, volume: 1.5e9, changePct: -1.08 },
  { symbol: "ADA/USD", price: 0.487, volume: 1.9e9, changePct: 1.12 },
  { symbol: "ADA/EUR", price: 0.448, volume: 1.1e9, changePct: 0.98 },
  { symbol: "AVAX/USD", price: 36.24, volume: 1.6e9, changePct: 2.45 },
];

type BinanceTicker = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
};

/** Parse Binance market symbol (e.g. BTCUSDT, ETHBTC) into a /-separated string. */
function splitBinanceSymbol(sym: string): string {
  const quotes = ["USDT", "USDC", "BUSD", "TUSD", "FDUSD", "USD", "EUR", "GBP", "BTC", "ETH"];
  for (const q of quotes) {
    if (sym.endsWith(q) && sym.length > q.length) {
      return `${sym.slice(0, -q.length)}/${q === "USDT" ? "USDT" : q}`;
    }
  }
  return sym;
}

function useBinanceMarkets(intervalMs = 5000) {
  const [markets, setMarkets] = useState<MarketRow[]>(FALLBACK);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchOnce = async () => {
      try {
        // 24h ticker, all markets
        const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const all: BinanceTicker[] = await res.json();
        if (cancelled) return;
        const picks = [
          "BTCUSDT", "BTCUSDC", "BTCEUR", "BTCGBP",
          "ETHUSDT", "ETHUSDC", "ETHEUR", "ETHBTC",
          "SOLUSDT", "XRPUSDT", "XRPEUR", "ADAUSDT",
          "AVAXUSDT", "LINKUSDT", "DOTUSDT",
        ];
        const rows: MarketRow[] = picks
          .map((s) => all.find((t) => t.symbol === s))
          .filter((t): t is BinanceTicker => !!t)
          .map((t) => ({
            symbol: splitBinanceSymbol(t.symbol),
            price: Number(t.lastPrice),
            volume: Number(t.quoteVolume),
            changePct: Number(t.priceChangePercent),
          }));
        setMarkets(rows);
        setError(null);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    };
    fetchOnce();
    const id = setInterval(fetchOnce, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [intervalMs]);

  return { markets, error };
}

const meta: Meta<typeof WatchList> = {
  title: "Exchange components/WatchList",
  component: WatchList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A searchable list of markets with category filters. Shows symbol, last price, 24h volume, and 24h % change.",
      },
      page: fabricDocsPage({
        status: "alpha",
        version: "0.1.0",
        owner: "Dave Blatherwick",
        lastUpdated: "2026-04-23",
        figma: {
          url: "https://www.figma.com/design/3IvLTqWEAlVjzcieRQd8vc/Crypto-PE-Screens?node-id=552-29683",
          label: "WatchList (Crypto PE Screens)",
          nodeId: "552:29683",
        },
        designNotes: [
          "Fixed 300px width, flexible height. Header + search bar + category tabs + 4-column table.",
          "Search + category filtering run client-side against the `markets` array — component doesn't fetch.",
          "24h % column uses --fabric-watchlist-up / -down tokens (green on dark, darker greens/reds on light).",
          "Selected row switches to a light surface colour (same as Figma's 'active' row) to match trading-UI convention.",
          "Volume is rendered compact (B/M/K) via a small in-component formatter; not token-driven.",
        ],
        a11yNotes: [
          "role=table / row / columnheader on the grid for assistive navigation.",
          "Category tabs use role=tablist + aria-selected for the active state.",
          "Rows are real <button>s so keyboard activation and focus are native.",
          "Numeric columns use font-variant-numeric: tabular-nums for aligned scanning.",
        ],
        limitations: [
          "No column sorting.",
          "No virtualisation — fine for ~50 rows, not for full Binance universe (~2000 symbols).",
          "No price-flash animation on update.",
          "Category list is string-based — no icon/coin metadata per category yet.",
        ],
        changelog: [
          {
            date: "2026-04-23",
            version: "0.1.0",
            changes: [
              "Initial port from Crypto PE Screens Figma frame.",
              "Tokenised for light/dark; search + category filters; selectable rows.",
              "Default story wires to Binance /ticker/24hr, polls every 5s.",
            ],
          },
        ],
      }),
    },
  },
};
export default meta;
type Story = StoryObj<typeof WatchList>;

const LiveRender = () => {
  const { markets, error } = useBinanceMarkets(5000);
  const [selected, setSelected] = useState("BTC/USDT");
  return (
    <div>
      <WatchList
        markets={markets}
        selectedSymbol={selected}
        onSelect={setSelected}
      />
      <p
        style={{
          marginTop: 12,
          fontSize: 11,
          color: error ? "var(--fabric-text-error-primary)" : "var(--fabric-text-tertiary)",
          fontFamily: "var(--fabric-font-family-body)",
          textAlign: "center",
          width: 300,
        }}
      >
        {error ? `Live feed error: ${error}` : "Live — Binance /ticker/24hr, polling every 5s"}
      </p>
    </div>
  );
};

export const Default: Story = {
  render: () => <LiveRender />,
};

export const Static: Story = {
  args: {
    markets: FALLBACK,
    selectedSymbol: "BTC/USDC",
  },
};
