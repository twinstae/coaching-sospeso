import { LoginForm } from "@/components/auth/LoginForm.tsx";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Base: Story = {
  args: {
  },
};
