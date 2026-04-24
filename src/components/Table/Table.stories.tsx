import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Table, TableRow, TableHeaderCell, TableCell, type SortDirection } from "./Table";
import { fabricDocsPage } from "../../docs/FabricDocsPage";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  subcomponents: { TableRow, TableHeaderCell, TableCell },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Primitive table building blocks — `Table`, `TableRow`, `TableHeaderCell`, `TableCell` — designed for dense, numerical fintech data. Compose them directly: `<Table><thead><TableRow><TableHeaderCell /></TableRow></thead><tbody>...</tbody></Table>`.",
      },
      page: fabricDocsPage({
        status: "alpha",
        version: "0.1.0",
        owner: "Dave Blatherwick",
        lastUpdated: "2026-04-24",
        figma: [
          {
            url: "https://www.figma.com/design/3AZXedsXs7QlKc5dJmzQfl/Adaptive---Design-System?node-id=4359-4452",
            label: "Table Header",
            nodeId: "4359:4452",
          },
          {
            url: "https://www.figma.com/design/3AZXedsXs7QlKc5dJmzQfl/Adaptive---Design-System?node-id=4360-4099",
            label: "Table Cell",
            nodeId: "4360:4099",
          },
        ],
        designNotes: [
          "Composable primitives rather than a high-level DataTable — consumers own the markup.",
          "Numeric columns use font-variant-numeric: tabular-nums so digits align visually across rows.",
          "TableCell value prop tints positive/negative values via --fabric-text-success-primary / --fabric-text-error-primary.",
          "Sort state is fully controlled by the consumer — the header just renders the indicator.",
        ],
        a11yNotes: [
          "Sortable headers set aria-sort (ascending / descending) based on the sort prop.",
          "Uses native <table>, <thead>, <tbody>, <tr>, <th>, <td> — standard semantics for assistive tech.",
        ],
        limitations: [
          "No row selection, sticky header, column resizing, or virtualisation.",
          "No built-in sorting logic — consumer manages data and sort state.",
          "No responsive layout for small viewports.",
        ],
        changelog: [
          {
            date: "2026-04-22",
            version: "0.1.0",
            changes: [
              "Initial primitives: Table / TableRow / TableHeaderCell / TableCell.",
              "Align, numeric, and positive/negative value tinting on cells.",
              "Sortable header with tri-state toggle.",
            ],
          },
        ],
      }),
    },
  },
};
export default meta;
type Story = StoryObj<typeof Table>;

const positions = [
  { symbol: "GBP/USD", qty: 120_000, px: 1.2684, pnl: 845.32 },
  { symbol: "EUR/USD", qty: 75_000, px: 1.0821, pnl: -212.15 },
  { symbol: "USD/JPY", qty: 200_000, px: 149.42, pnl: 1_204.00 },
  { symbol: "AUD/NZD", qty: 50_000, px: 1.0734, pnl: -58.90 },
];

const fmt = (n: number, opts: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4, ...opts }).format(n);

// Extracted as a real React component so useState is called inside a
// function component (not in an anonymous render callback).
const PositionsStory = () => {
  const [sort, setSort] = useState<SortDirection>("asc");
  const rows = [...positions].sort((a, b) =>
    sort === "asc" ? a.pnl - b.pnl : sort === "desc" ? b.pnl - a.pnl : 0,
  );
  const cycle = (): SortDirection =>
    sort === "asc" ? "desc" : sort === "desc" ? false : "asc";
  return (
    <div style={{ width: 640 }}>
      <Table>
        <thead>
          <TableRow>
            <TableHeaderCell>Symbol</TableHeaderCell>
            <TableHeaderCell align="right">Quantity</TableHeaderCell>
            <TableHeaderCell align="right">Price</TableHeaderCell>
            <TableHeaderCell align="right" sortable sort={sort} onSort={() => setSort(cycle())}>
              P&L
            </TableHeaderCell>
          </TableRow>
        </thead>
        <tbody>
          {rows.map((r) => (
            <TableRow key={r.symbol}>
              <TableCell>{r.symbol}</TableCell>
              <TableCell numeric>{fmt(r.qty, { maximumFractionDigits: 0 })}</TableCell>
              <TableCell numeric>{fmt(r.px)}</TableCell>
              <TableCell numeric value={r.pnl >= 0 ? "positive" : "negative"}>
                {r.pnl >= 0 ? "+" : ""}
                {fmt(r.pnl)}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export const PositionsTable: Story = {
  render: () => <PositionsStory />,
};
