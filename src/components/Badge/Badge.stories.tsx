import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "select", options: ["gray", "brand", "error", "warning", "success", "buy", "sell"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    dot: { control: "boolean" },
  },
  args: { children: "Badge", color: "brand", size: "md" },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {(["gray", "brand", "error", "warning", "success", "buy", "sell"] as const).map((c) => (
        <Badge {...args} key={c} color={c} dot>{c}</Badge>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Badge {...args} size="sm">Small</Badge>
      <Badge {...args} size="md">Medium</Badge>
      <Badge {...args} size="lg">Large</Badge>
    </div>
  ),
};
