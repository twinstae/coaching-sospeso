import { UpdateUserForm } from "@/components/auth/UpdateUserForm.tsx";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof UpdateUserForm> = {
  component: UpdateUserForm,
};

export default meta;
type Story = StoryObj<typeof UpdateUserForm>;

export const Base: Story = {
  args: {
    user: {
      name: "김토끼",
      nickname: "손님",
      phone: "",
    },
  },
};
