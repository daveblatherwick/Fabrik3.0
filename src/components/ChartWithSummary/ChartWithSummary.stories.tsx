import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useMemo, useState } from "react";
import { ChartWithSummary, type ChartPoint, type Timeframe } from "./ChartWithSummary";
import { fabricDocsPage } from "../../docs/FabricDocsPage";

/** Map our timeframe to a Binance klines interval + sample size. */
const TF_CONFIG: Record<Timeframe, { interval: string; limit: number }> = {
  "1m": { interval: "1m", limit: 180 },
  "5m": { interval: "5m", limit: 288 },
  "15m": { interval: "15m", limit: 192 },
  "1h": { interval: "1h", limit: 240 },
  "4h": { interval: "4h", limit: 180 },
  "1D": { interval: "1d", limit: 365 },
};

const FALLBACK_DATA: ChartPoint[] = Array.from({ length: 100 }, (_, i) => ({
  time: Math.floor(Date.now() / 1000) - (100 - i) * 86400,
  value: 16700 + Math.sin(i / 8) * 200 + (Math.random() - 0.5) * 80,
}));

type Binance24h = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  priceChange: string;
  highPrice: string;
  lowPrice: string;
  quoteVolume: string;
  openPrice: string;
  prevClosePrice: string;
};

function useBinanceKlines(symbol: string, timeframe: Timeframe) {
  const [data, setData] = useState<ChartPoint[]>(FALLBACK_DATA);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const { interval, limit } = TF_CONFIG[timeframe];
    (async () => {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw: unknown[][] = await res.json();
        if (cancelled) return;
        const points: ChartPoint[] = raw.map((k) => ({
          time: Math.floor((k[0] as number) / 1000),
          value: Number(k[4]),
        }));
        setData(points);
        setError(null);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => { cancelled = true; };
  }, [symbol, timeframe]);

  return { data, error };
}

function useBinance24h(symbol: string, intervalMs = 5000) {
  const [ticker, setTicker] = useState<Binance24h | null>(null);
  useEffect(() => {
    let cancelled = false;
    const fetchOnce = async () => {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        if (!res.ok) return;
        const t = (await res.json()) as Binance24h;
        if (!cancelled) setTicker(t);
      } catch { /* ignore */ }
    };
    fetchOnce();
    const id = setInterval(fetchOnce, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [symbol, intervalMs]);
  return ticker;
}

const meta: Meta<typeof ChartWithSummary> = {
  title: "Exchange components/ChartWithSummary",
  component: ChartWithSummary,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A composite crypto trading view: product header + OHLCV metrics, a TradingView Lightweight Charts area chart, a timeframe selector, and a tools sidebar.",
      },
      page: fabricDocsPage({
        status: "alpha",
        version: "0.1.0",
        owner: "Dave Blatherwick",
        lastUpdated: "2026-04-23",
        figma: {
          url: "https://www.figma.com/design/3IvLTqWEAlVjzcieRQd8vc/Crypto-PE-Screens?node-id=552-34097",
          label: "Chart with Summary (Crypto PE Screens)",
          nodeId: "552:34097",
        },
        designNotes: [
          "Chart rendered by TradingView Lightweight Charts v5 (free, MIT). Palette read from --fabric-chart-* tokens and re-applied whenever data-theme/brand/density changes on the document root, via a MutationObserver.",
          "Fixed 810px width matching the Figma frame. Grid: 32px tools sidebar + flexible chart column.",
          "Timeframe tabs are controlled or uncontrolled — if onTimeframeChange is provided the consumer owns state.",
          "Metrics strip accepts arbitrary label/value pairs plus an optional `trend` prop that tints the value green or red.",
          "Currency tiles (see the standalone CurrencyTile primitive) were in the Figma frame but belong to the FX RFQ surface, not a crypto chart — intentionally omitted here.",
        ],
        a11yNotes: [
          "Timeframe tabs use role=tablist + aria-selected.",
          "Tool buttons expose aria-label per tool (Brush, Text, Ruler, etc.).",
          "Chart canvas itself comes from lightweight-charts; pair with a visible data summary for assistive tech.",
        ],
        limitations: [
          "Chart theme is snapshotted at mount — switching light/dark doesn't re-read tokens until remount.",
          "No OHLC/candlestick variant wired — uses AreaSeries only.",
          "Tool buttons are visual only; no drawing/annotation behaviour.",
          "Timeframe fetches replace the data set; no smart incremental updates.",
        ],
        changelog: [
          {
            date: "2026-04-23",
            version: "0.1.0",
            changes: [
              "Initial port from Crypto PE Screens Figma frame.",
              "TradingView Lightweight Charts v5 wired to Binance /api/v3/klines with per-timeframe interval/limit.",
              "24h metrics strip fed from /api/v3/ticker/24hr, 5s polling.",
              "New CurrencyTile primitive used for the right column.",
            ],
          },
        ],
      }),
    },
  },
};
export default meta;
type Story = StoryObj<typeof ChartWithSummary>;

const fmtUsd = (n: number, dp = 2) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

const LiveRender = () => {
  const [tf, setTf] = useState<Timeframe>("1D");
  const symbol = "BTCUSDT";
  const { data } = useBinanceKlines(symbol, tf);
  const t = useBinance24h(symbol);

  const metrics = useMemo(() => {
    if (!t) return [];
    const change = Number(t.priceChange);
    const changePct = Number(t.priceChangePercent);
    const trend: "up" | "down" = change >= 0 ? "up" : "down";
    return [
      { label: "Last", value: fmtUsd(Number(t.lastPrice)) },
      {
        label: "24h Change",
        value: `${change >= 0 ? "+" : ""}${change.toFixed(2)} (${changePct.toFixed(2)}%)`,
        trend,
      },
      { label: "24h High", value: fmtUsd(Number(t.highPrice)) },
      { label: "24h Low", value: fmtUsd(Number(t.lowPrice)) },
      {
        label: "24h Vol (USD)",
        value:
          Number(t.quoteVolume) >= 1e9
            ? (Number(t.quoteVolume) / 1e9).toFixed(1) + "B"
            : (Number(t.quoteVolume) / 1e6).toFixed(1) + "M",
      },
    ];
  }, [t]);

  return (
    <ChartWithSummary
      symbol="BTC/USDT"
      productName="Bitcoin"
      data={data}
      timeframe={tf}
      onTimeframeChange={setTf}
      metrics={metrics}
    />
  );
};

export const Default: Story = {
  render: () => <LiveRender />,
};
