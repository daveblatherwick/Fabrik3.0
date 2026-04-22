import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { DepthChart, type DepthLevel } from "./DepthChart";

const FALLBACK_ASKS: DepthLevel[] = [
  { price: 79_189.00, total: 0.0145 },
  { price: 79_190.50, total: 0.0425 },
  { price: 79_191.20, total: 0.0737 },
  { price: 79_192.40, total: 0.1187 },
  { price: 79_193.80, total: 0.1812 },
  { price: 79_195.20, total: 0.2702 },
  { price: 79_197.60, total: 0.3912 },
  { price: 79_200.40, total: 0.5452 },
  { price: 79_204.80, total: 0.7437 },
];
const FALLBACK_BIDS: DepthLevel[] = [
  { price: 79_188.00, total: 0.0170 },
  { price: 79_187.50, total: 0.0465 },
  { price: 79_186.20, total: 0.0875 },
  { price: 79_184.80, total: 0.1435 },
  { price: 79_182.30, total: 0.2155 },
  { price: 79_180.10, total: 0.3100 },
  { price: 79_176.70, total: 0.4330 },
  { price: 79_172.40, total: 0.5900 },
  { price: 79_166.20, total: 0.7910 },
];

function toLevels(entries: [string, string][]): DepthLevel[] {
  let running = 0;
  return entries.map(([p, a]) => {
    running += Number(a);
    return { price: Number(p), total: running };
  });
}

function useBinanceBook(symbol: string, limit = 20, intervalMs = 2000) {
  const [asks, setAsks] = useState<DepthLevel[]>(FALLBACK_ASKS);
  const [bids, setBids] = useState<DepthLevel[]>(FALLBACK_BIDS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchOnce = async () => {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const depth: { bids: [string, string][]; asks: [string, string][] } = await res.json();
        if (cancelled) return;
        setAsks(toLevels(depth.asks));
        setBids(toLevels(depth.bids));
        setError(null);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    };
    fetchOnce();
    const id = setInterval(fetchOnce, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [symbol, limit, intervalMs]);

  return { asks, bids, error };
}

const meta: Meta<typeof DepthChart> = {
  title: "Exchange components/DepthChart",
  component: DepthChart,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof DepthChart>;

const LiveRender = () => {
  const { asks, bids, error } = useBinanceBook("BTCUSDT", 20, 2000);
  const topVol = Math.max(asks[asks.length - 1]?.total ?? 0, bids[bids.length - 1]?.total ?? 0);
  const fmt = (n: number) => n.toFixed(2);
  return (
    <div>
      <DepthChart
        asks={asks}
        bids={bids}
        height={692}
        labels={[fmt(topVol), fmt(topVol * 0.5), fmt(topVol * 0.22)]}
      />
      <p
        style={{
          marginTop: 12,
          fontSize: 11,
          color: error ? "var(--fabric-text-error-primary)" : "var(--fabric-text-tertiary)",
          fontFamily: "var(--fabric-font-family-body)",
          textAlign: "center",
          width: 184,
        }}
      >
        {error ? `Live feed error: ${error}` : "Live — Binance BTCUSDT, polling every 2s"}
      </p>
    </div>
  );
};

export const Default: Story = {
  render: () => <LiveRender />,
};

export const Static: Story = {
  args: {
    asks: FALLBACK_ASKS,
    bids: FALLBACK_BIDS,
    height: 692,
    labels: ["72.45", "38.10", "19.85"],
  },
};
