import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { fabricDocsPage } from "../../docs/FabricDocsPage";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A clickable element that initiates an action. V1 implements the **Filled + Brand** combination at three sizes.",
      },
      page: fabricDocsPage({
        status: "alpha",
        version: "0.1.0",
        owner: "Dave Blatherwick",
        lastUpdated: "2026-04-22",
        figma: {
          url: "https://www.figma.com/design/3AZXedsXs7QlKc5dJmzQfl/Adaptive---Design-System?node-id=159-1935",
          label: "Button — 6 variant axes (Style, Type, Size, Warning, State, Icon only)",
          nodeId: "159:1935",
        },
        designNotes: [
          "Figma variants collapse to 3 × 2 × 3 × 2 × 4 × 2 = 288 theoretical combos. V1 implements 3 (sizes) × 1 (filled brand) = 3 rendered states.",
          "Brand colour comes from --fabric-button-brand-bg which resolves per brand (Adaptive purple / Aeron green / Demo blue).",
          "Padding and radius scale with density; hover/focus/disabled derived from CSS pseudo-classes, not props.",
        ],
        a11yNotes: [
          "Uses native <button>; gets focus, keyboard, and screen reader semantics for free.",
          "Focus ring uses --fabric-focus-ring; meets 3:1 contrast against all theme backgrounds.",
          "disabled prop sets aria-disabled implicitly via native semantics.",
        ],
        limitations: [
          "Outlined and Text variants not yet implemented.",
          "Type=Primary uses different tokens than Type=Brand — currently both map to the same output.",
          "Warning and Icon-only variants not yet implemented.",
          "No loading/pending state.",
        ],
        changelog: [
          {
            date: "2026-04-22",
            version: "0.1.0",
            changes: [
              "Initial prototype: Filled + Brand only, sizes xs/sm/lg.",
              "Tokenised via --fabric-button-brand-* and density-aware spacing/radius.",
            ],
          },
        ],
      }),
    },
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
