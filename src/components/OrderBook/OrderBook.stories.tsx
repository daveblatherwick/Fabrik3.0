import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { OrderBook, type OrderLevel } from "./OrderBook";

const FALLBACK_ASKS: OrderLevel[] = [
  { price: 79_189.00, amount: 0.0145, total: 0.0145 },
  { price: 79_190.50, amount: 0.0280, total: 0.0425 },
  { price: 79_191.20, amount: 0.0312, total: 0.0737 },
  { price: 79_192.40, amount: 0.0450, total: 0.1187 },
  { price: 79_193.80, amount: 0.0625, total: 0.1812 },
  { price: 79_195.20, amount: 0.0890, total: 0.2702 },
  { price: 79_197.60, amount: 0.1210, total: 0.3912 },
  { price: 79_200.40, amount: 0.1540, total: 0.5452 },
  { price: 79_204.80, amount: 0.1985, total: 0.7437 },
];
const FALLBACK_BIDS: OrderLevel[] = [
  { price: 79_188.00, amount: 0.0170, total: 0.0170 },
  { price: 79_187.50, amount: 0.0295, total: 0.0465 },
  { price: 79_186.20, amount: 0.0410, total: 0.0875 },
  { price: 79_184.80, amount: 0.0560, total: 0.1435 },
  { price: 79_182.30, amount: 0.0720, total: 0.2155 },
  { price: 79_180.10, amount: 0.0945, total: 0.3100 },
  { price: 79_176.70, amount: 0.1230, total: 0.4330 },
  { price: 79_172.40, amount: 0.1570, total: 0.5900 },
  { price: 79_166.20, amount: 0.2010, total: 0.7910 },
];

type BinanceDepth = {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
};

function toLevels(entries: [string, string][]): OrderLevel[] {
  let running = 0;
  return entries.map(([p, a]) => {
    const price = Number(p);
    const amount = Number(a);
    running += amount;
    return { price, amount, total: running };
  });
}

function useBinanceBook(symbol: string, limit = 10, intervalMs = 2000) {
  const [asks, setAsks] = useState<OrderLevel[]>(FALLBACK_ASKS);
  const [bids, setBids] = useState<OrderLevel[]>(FALLBACK_BIDS);
  const [lastPrice, setLastPrice] = useState<number>(79_188.50);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchOnce = async () => {
      try {
        const [depthRes, tickerRes] = await Promise.all([
          fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`),
          fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`),
        ]);
        if (!depthRes.ok || !tickerRes.ok) throw new Error(`HTTP ${depthRes.status}/${tickerRes.status}`);
        const depth: BinanceDepth = await depthRes.json();
        const ticker: { price: string } = await tickerRes.json();
        if (cancelled) return;
        setAsks(toLevels(depth.asks));
        setBids(toLevels(depth.bids));
        setLastPrice(Number(ticker.price));
        setError(null);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    };
    fetchOnce();
    const id = setInterval(fetchOnce, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [symbol, limit, intervalMs]);

  return { asks, bids, lastPrice, error };
}

const meta: Meta<typeof OrderBook> = {
  title: "Exchange components/OrderBook",
  component: OrderBook,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof OrderBook>;

const LiveRender = () => {
  const { asks, bids, lastPrice, error } = useBinanceBook("BTCUSDT", 10, 2000);
  return (
    <div>
      <OrderBook
        asks={asks}
        bids={bids}
        lastPrice={lastPrice}
        baseSymbol="BTC"
        priceDecimals={2}
        amountDecimals={4}
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
        {error ? `Live feed error: ${error} — showing cached data` : "Live — Binance BTCUSDT, polling every 2s"}
      </p>
    </div>
  );
};

export const Default: Story = {
  render: () => <LiveRender />,
};

export const Sparse: Story = {
  args: {
    asks: FALLBACK_ASKS.slice(0, 4),
    bids: FALLBACK_BIDS.slice(0, 4),
    lastPrice: 79_188.50,
    baseSymbol: "BTC",
    priceDecimals: 2,
    amountDecimals: 4,
  },
};
