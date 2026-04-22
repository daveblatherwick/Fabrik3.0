import type { Meta, StoryObj } from "@storybook/react";
import { OrderBook, type OrderLevel } from "./OrderBook";

const asks: OrderLevel[] = [
  { price: 16_699.80, amount: 0.0145, total: 0.0145 },
  { price: 16_700.20, amount: 0.0280, total: 0.0425 },
  { price: 16_701.10, amount: 0.0312, total: 0.0737 },
  { price: 16_702.40, amount: 0.0450, total: 0.1187 },
  { price: 16_703.80, amount: 0.0625, total: 0.1812 },
  { price: 16_705.20, amount: 0.0890, total: 0.2702 },
  { price: 16_707.60, amount: 0.1210, total: 0.3912 },
  { price: 16_710.40, amount: 0.1540, total: 0.5452 },
  { price: 16_714.80, amount: 0.1985, total: 0.7437 },
];

const bids: OrderLevel[] = [
  { price: 16_698.00, amount: 0.0170, total: 0.0170 },
  { price: 16_697.50, amount: 0.0295, total: 0.0465 },
  { price: 16_696.20, amount: 0.0410, total: 0.0875 },
  { price: 16_694.80, amount: 0.0560, total: 0.1435 },
  { price: 16_692.30, amount: 0.0720, total: 0.2155 },
  { price: 16_690.10, amount: 0.0945, total: 0.3100 },
  { price: 16_686.70, amount: 0.1230, total: 0.4330 },
  { price: 16_682.40, amount: 0.1570, total: 0.5900 },
  { price: 16_676.20, amount: 0.2010, total: 0.7910 },
];

const meta: Meta<typeof OrderBook> = {
  title: "Exchange components/OrderBook",
  component: OrderBook,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof OrderBook>;

export const BTCUSD: Story = {
  args: {
    asks,
    bids,
    lastPrice: 16_698.40,
    baseSymbol: "BTC",
    priceDecimals: 2,
    amountDecimals: 4,
  },
};

export const Sparse: Story = {
  args: {
    asks: asks.slice(0, 4),
    bids: bids.slice(0, 4),
    lastPrice: 16_698.40,
    baseSymbol: "BTC",
  },
};
