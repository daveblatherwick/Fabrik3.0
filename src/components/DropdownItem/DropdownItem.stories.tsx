import type { Meta, StoryObj } from "@storybook/react";
import { DropdownItem } from "./DropdownItem";

const meta: Meta<typeof DropdownItem> = {
  title: "Components/DropdownItem",
  component: DropdownItem,
  tags: ["autodocs"],
  args: { children: "Option A" },
};
export default meta;
type Story = StoryObj<typeof DropdownItem>;

export const Default: Story = {};

export const WithMeta: Story = { args: { meta: "⌘K" } };

export const Selected: Story = { args: { selected: true } };

export const InMenu: Story = {
  render: () => (
    <div
      role="menu"
      style={{
        width: 240,
        padding: 6,
        border: "1px solid var(--fabric-border-secondary)",
        borderRadius: 8,
        background: "var(--fabric-bg-primary)",
        boxShadow: "var(--fabric-shadow-md)",
      }}
    >
      <DropdownItem>Dashboard</DropdownItem>
      <DropdownItem meta="⌘O">Open order</DropdownItem>
      <DropdownItem selected>Positions</DropdownItem>
      <DropdownItem disabled>Archived</DropdownItem>
    </div>
  ),
};
