import { Pagination } from "@/shared/Pagination.tsx";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Base: Story = {
  args: {
    current: 2,
  },
};
