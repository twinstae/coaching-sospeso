import { SospesoFilter } from "@/components/SospesoFilter.tsx";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoFilter> = {
  component: SospesoFilter,
};

export default meta;
type Story = StoryObj<typeof SospesoFilter>;

export const Base: Story = {
  args: {},
};
