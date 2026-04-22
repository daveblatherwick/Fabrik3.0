import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tab";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    items: [
      { value: "overview", label: "Overview" },
      { value: "positions", label: "Positions", badge: 4 },
      { value: "orders", label: "Orders" },
      { value: "activity", label: "Activity" },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    items: [
      { value: "one", label: "Available" },
      { value: "two", label: "Locked", disabled: true },
      { value: "three", label: "Coming Soon", disabled: true },
    ],
  },
};
