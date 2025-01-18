import { SospesoTimeline } from "@/components/SospesoTimeline";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoTimeline> = {
  component: SospesoTimeline,
};

export default meta;
type Story = StoryObj<typeof SospesoTimeline>;

export const Base: Story = {
  args: {},
};
