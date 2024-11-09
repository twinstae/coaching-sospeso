import { Pagination } from "@/shared/Pagination.tsx";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Base: Story = {
  args: {
    routeKey: "홈",
    params: undefined,
    current: 2,
    end: 4,
  },
};

export const First: Story = {
  args: {
    routeKey: "홈",
    params: undefined,
    current: 1,
    end: 4,
  },
};

export const End: Story = {
  args: {
    routeKey: "홈",
    params: undefined,
    current: 4,
    end: 4,
  },
};
