import { SignUpForm } from "@/components/auth/SignUpForm.tsx";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SignUpForm> = {
  component: SignUpForm,
};

export default meta;
type Story = StoryObj<typeof SignUpForm>;

export const Base: Story = {
  args: {},
};
