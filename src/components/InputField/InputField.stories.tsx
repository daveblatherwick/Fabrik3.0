import type { Meta, StoryObj } from "@storybook/react";
import { InputField } from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  tags: ["autodocs"],
  args: {
    label: "Email",
    placeholder: "you@example.com",
  },
};
export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "We'll never share your email." },
};

export const WithError: Story = {
  args: { error: "Email is required.", defaultValue: "" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "locked@example.com" },
};

export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: <span>@</span>,
    placeholder: "username",
  },
};
