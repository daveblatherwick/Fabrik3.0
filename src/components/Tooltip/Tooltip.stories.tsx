import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button/Button";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: { side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] } },
  args: { content: "Tooltip text", side: "top" },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: { defaultOpen: true, children: <Button>Hover me</Button> },
};

export const AllSides: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: 24, padding: 48 }}>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} content={`Side: ${side}`} side={side} defaultOpen>
          <Button>{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
