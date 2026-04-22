import type { Meta, StoryObj } from "@storybook/react";
import { NavItem } from "./NavItem";
import { Badge } from "../Badge/Badge";

const DotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3" fill="currentColor" />
  </svg>
);

const meta: Meta<typeof NavItem> = {
  title: "Components/NavItem",
  component: NavItem,
  args: { children: "Dashboard", icon: <DotIcon /> },
};
export default meta;
type Story = StoryObj<typeof NavItem>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const WithTrailing: Story = { args: { active: true, trailing: <Badge color="brand" size="sm">12</Badge> } };

export const SideNav: Story = {
  render: () => (
    <nav
      style={{
        width: 240,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        border: "1px solid var(--fabric-border-secondary)",
        borderRadius: 12,
        background: "var(--fabric-bg-primary)",
      }}
    >
      <NavItem icon={<DotIcon />}>Home</NavItem>
      <NavItem icon={<DotIcon />} active trailing={<Badge size="sm" color="brand">3</Badge>}>Positions</NavItem>
      <NavItem icon={<DotIcon />}>Orders</NavItem>
      <NavItem icon={<DotIcon />}>Reports</NavItem>
      <NavItem icon={<DotIcon />} disabled>Admin</NavItem>
    </nav>
  ),
};
