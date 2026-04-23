import type { Meta, StoryObj } from "@storybook/react";
import { CryptoTradingTile, type DepthLevel } from "./CryptoTradingTile";
import { fabricDocsPage } from "../../docs/FabricDocsPage";

const DEPTH_BIDS: DepthLevel[] = [
  { price: 8081.44, size: 3.10 },
  { price: 8079.91, size: 0.03 },
  { price: 8079.90, size: 6.19 },
  { price: 8079.80, size: 0.02 },
  { price: 8077.77, size: 0.01 },
  { price: 8077.50, size: 1.00 },
  { price: 8075.45, size: 2.36 },
  { price: 8075.40, size: 7.23 },
  { price: 8075.35, size: 2.10 },
  { price: 8075.30, size: 0.23 },
];

const DEPTH_ASKS: DepthLevel[] = [
  { price: 8090.18, size: 0.18 },
  { price: 8090.21, size: 0.74 },
  { price: 8090.86, size: 1.01 },
  { price: 8091.61, size: 0.01 },
  { price: 8092.00, size: 1.00 },
  { price: 8092.05, size: 1.20 },
  { price: 8075.45, size: 2.36 },
  { price: 8075.40, size: 5.65 },
  { price: 8075.35, size: 3.21 },
  { price: 8075.30, size: 0.98 },
];

const DEFAULT_ARGS = {
  symbol: "BTCUSD",
  asset: "BTC",
  bidPrice: 8081.44,
  bidDelta: 3.10,
  bidSize: 8.74,
  offerPrice: 8090.18,
  offerDelta: 0.18,
  low: 8021.75,
  high: 8145.32,
  quantity: 1,
  depthBids: DEPTH_BIDS,
  depthAsks: DEPTH_ASKS,
};

const meta: Meta<typeof CryptoTradingTile> = {
  title: "Exchange components/CryptoTradingTile",
  component: CryptoTradingTile,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An RFQ-style crypto trading tile — sell / buy quotes, per-side hover + active states, a 'Place Bid' and 'Place Offer' action strip that expands into an inline Limit Order Entry form. Supports 5 market states (open / auction / halted / closed / no market) and 3 layouts (collapsed / market depth / limit order entry).",
      },
      page: fabricDocsPage({
        status: "alpha",
        version: "0.1.0",
        owner: "Dave Blatherwick",
        lastUpdated: "2026-04-23",
        figma: {
          url: "https://www.figma.com/design/3IvLTqWEAlVjzcieRQd8vc/Crypto-PE-Screens?node-id=24-24197",
          label: "Crypto Tile (24 variants — 3 layouts × 5 states × interaction)",
          nodeId: "24:24197",
        },
        designNotes: [
          "The Figma component set has 24 variants across three axes: layout (Collapsed / Market Depth / Limit Order Entry / Combined), market state (Mkt Open / In Auction / Halted / Closed / No Orders), and interaction state (Default / Hover / Buy Side Hover / Sell Side Hover / Place bid active / Place offer active). Hover + side-hover are handled via CSS pseudo-classes; layout + state + active-side are real props.",
          "Bid (sell-BTC) side uses --fabric-cryptotile-sell (error red). Offer (buy-BTC) side uses --fabric-cryptotile-buy (brand). Active footer rows switch to the full accent fill (#E31B54 / brand-600) matching the Figma design.",
          "Reuses InputField for the order form — consistent field styling (label, input, hint) with the rest of the design system.",
          "Layout upgrades automatically: passing activeSide collapses the `layout` prop and shows the inline Limit Order Entry form regardless of what was set.",
          "Quantity input in the header is a native <input type='number'> wrapped in the tokenised header strip — no custom number stepper.",
        ],
        a11yNotes: [
          "Side quote buttons are real <button>s with aria-label including the action (Place bid on BTCUSD).",
          "Order form tabs use role=tablist and aria-selected.",
          "disabled states are native — screen readers announce Halted/Closed states via the status pill text plus button disabled semantics.",
          "Numeric values use font-variant-numeric: tabular-nums for visual alignment.",
        ],
        limitations: [
          "No live data feed — story uses static mock levels.",
          "Order-type tabs beyond 'Limit' render but don't switch form fields.",
          "Time-in-force is a plain input, not a dropdown.",
          "No price flash on update.",
          "Market-depth variant renders a simple 4-column grid — no depth bars, no hover-row select.",
        ],
        changelog: [
          {
            date: "2026-04-23",
            version: "0.1.0",
            changes: [
              "Initial port of the 24-variant Crypto Tile set from Figma (node 24:24197).",
              "3 layouts, 5 market states, controlled or uncontrolled active-side.",
              "Inline limit-order-entry form built from InputField primitive.",
              "Tokenised via --fabric-cryptotile-* for all surfaces, muted text, accent colours, status pills, and active footer fills.",
            ],
          },
        ],
      }),
    },
  },
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["open", "auction", "halted", "closed", "noMarket"],
    },
    layout: {
      control: "inline-radio",
      options: ["collapsed", "marketDepth", "limitOrderEntry", "combined"],
    },
    activeSide: {
      control: "inline-radio",
      options: [null, "bid", "offer"],
    },
  },
  args: DEFAULT_ARGS,
};
export default meta;
type Story = StoryObj<typeof CryptoTradingTile>;

export const Default: Story = {};

export const MarketDepth: Story = {
  args: { layout: "marketDepth" },
};

export const LimitOrderEntryBid: Story = {
  name: "Limit Order Entry — Bid active",
  args: { activeSide: "bid" },
};

export const LimitOrderEntryOffer: Story = {
  name: "Limit Order Entry — Offer active",
  args: { activeSide: "offer" },
};

export const InAuction: Story = {
  args: { state: "auction" },
};

export const Halted: Story = {
  args: { state: "halted" },
};

export const Closed: Story = {
  args: { state: "closed" },
};

export const NoMarket: Story = {
  args: { state: "noMarket" },
};

export const AllStatesCollapsed: Story = {
  name: "All market states (collapsed)",
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 346px)", gap: 16 }}>
      <CryptoTradingTile {...args} state="open" />
      <CryptoTradingTile {...args} state="auction" />
      <CryptoTradingTile {...args} state="halted" />
      <CryptoTradingTile {...args} state="closed" />
      <CryptoTradingTile {...args} state="noMarket" />
    </div>
  ),
};
