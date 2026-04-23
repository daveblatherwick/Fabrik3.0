import type { Meta, StoryObj } from "@storybook/react";
import { CcyTile } from "./CcyTile";
import { fabricDocsPage } from "../../docs/FabricDocsPage";

const BASE = {
  pair: "EUR/USD",
  spotLabel: "Spot (09 Nov)",
  sell: 1.36043,
  buy: 1.36065,
  spreadPips: 2.2,
  trendingUp: true,
  low: 1.35795,
  high: 1.36801,
  quantity: 10_000_000,
  priceDecimals: 5,
};

const SPARKLINE = Array.from({ length: 40 }, (_, i) =>
  1.358 + Math.sin(i / 3) * 0.003 + (Math.random() - 0.5) * 0.002,
);

const meta: Meta<typeof CcyTile> = {
  title: "FX Components/Currency Tile",
  component: CcyTile,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A currency-pair trading tile used on the FX trading surface. Shows the pair, quantity, bid/offer prices with a spread-pip indicator, an optional sparkline, and an action strip. Ported from the 3. RT FX Credit Equities design kit (CCY Tile component set, 7 variants).",
      },
      page: fabricDocsPage({
        status: "alpha",
        version: "0.1.0",
        owner: "Dave Blatherwick",
        lastUpdated: "2026-04-23",
        figma: {
          url: "https://www.figma.com/design/7OlEKFWQmbeC3sqJTdc2bZ/3.-RT-FX-Credit-Equities?node-id=25-6787",
          label: "CCY Tile (3. RT FX Credit Equities — 7 variants)",
          nodeId: "25:6787",
        },
        designNotes: [
          "The Figma component set has 5 boolean axes (Brand, MVP, Re-style, Changeable ccypair, Chart). Collapsed down to 5 React props (brand, minimal, restyle, editablePair, sparkline).",
          "Every colour flows through --fabric-ccytile-* tokens so the tile follows light/dark and brand changes.",
          "Quote buttons pick up --fabric-ccytile-down (sell) and --fabric-ccytile-up (buy) on hover — matches the FX convention (red = sell, green = buy) rather than the brand-purple used in the Crypto tile.",
          "Sparkline is a hand-rolled SVG path — no dependency, fills in under 1ms regardless of point count.",
          "Reuses the Fabric tokens from the Adaptive DS (brand, success, error, spacing, radius, typography) even though the source Figma lives in a different file — the tokens are shared.",
        ],
        a11yNotes: [
          "Sell / Buy are real <button>s with aria-label including the base currency.",
          "Quantity + pair inputs wired to onChange callbacks so consumers can control state; aria-labels on both.",
          "Sparkline is decorative (aria-hidden not needed as SVG without role).",
        ],
        limitations: [
          "Footer action chips are cosmetic — Split / Send don't open a real order form yet.",
          "Minimal layout drops the info strip + footer entirely — no progressive disclosure.",
          "Sparkline auto-scales to its own min/max; no explicit price axis.",
          "No streaming / price flash animation.",
        ],
        changelog: [
          {
            date: "2026-04-23",
            version: "0.1.0",
            changes: [
              "Initial port from the 3. RT FX Credit Equities CCY Tile (node 25:6787).",
              "5 Figma variant axes collapsed to 5 React props + hover via CSS.",
              "Tokenised against --fabric-ccytile-* across light / dark.",
              "Inline SVG sparkline for the Chart=true variant.",
            ],
          },
        ],
      }),
    },
  },
  args: BASE,
};
export default meta;
type Story = StoryObj<typeof CcyTile>;

export const Default: Story = {};

export const WithBrand: Story = {
  args: { brand: true },
};

export const MVP: Story = {
  name: "MVP (minimal)",
  args: { minimal: true },
};

export const MVPWithBrand: Story = {
  name: "MVP with brand strip",
  args: { minimal: true, brand: true },
};

export const Restyled: Story = {
  args: { minimal: true, restyle: true },
};

export const WithSparkline: Story = {
  args: { sparkline: SPARKLINE },
};

export const EditablePair: Story = {
  args: { editablePair: true },
};

export const Grid: Story = {
  name: "Grid of variants",
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 270px)", gap: 16 }}>
      <CcyTile {...args} pair="EUR/USD" sell={1.36043} buy={1.36065} spreadPips={2.2} />
      <CcyTile {...args} pair="GBP/USD" sell={1.26640} buy={1.26661} spreadPips={2.1} trendingUp={false} />
      <CcyTile {...args} pair="USD/JPY" sell={149.683} buy={149.702} spreadPips={1.9} priceDecimals={3} />
      <CcyTile {...args} pair="AUD/USD" sell={0.66112} buy={0.66135} spreadPips={2.3} brand />
      <CcyTile {...args} pair="EUR/GBP" sell={0.85991} buy={0.86014} spreadPips={2.3} sparkline={SPARKLINE} />
      <CcyTile {...args} pair="USD/CHF" sell={0.88240} buy={0.88268} spreadPips={2.8} minimal />
    </div>
  ),
};
