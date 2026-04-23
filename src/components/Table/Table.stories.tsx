import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Table, TableRow, TableHeaderCell, TableCell, type SortDirection } from "./Table";

const meta: Meta = {
  title: "Components/Table",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

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
