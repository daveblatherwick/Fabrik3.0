import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["filled", "text", "outlined"],
      description: 'Figma "Style" axis. V1 implements filled only.',
    },
    kind: {
      control: "inline-radio",
      options: ["brand", "primary"],
      description: 'Figma "Type" axis. V1 implements brand only.',
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "lg"],
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    variant: "filled",
    kind: "brand",
    size: "sm",
    children: "Button",
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: {
    disabled: false
  }
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button {...args} size="xs">Button xs</Button>
      <Button {...args} size="sm">Button sm</Button>
      <Button {...args} size="lg">Button lg</Button>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button {...args}>Default</Button>
      <Button {...args} className="hover-demo">Hover (inspect)</Button>
      <Button {...args} autoFocus>Focus</Button>
      <Button {...args} disabled>Disabled</Button>
    </div>
  ),
};
