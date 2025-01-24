import { SospesoTimeline } from "@/components/SospesoTimeline";
import {
  CONSUMED_SOSPESO,
  ISSUED_SOSPESO,
  PENDING_SOSPESO,
} from "@/sospeso/fixtures";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoTimeline> = {
  component: SospesoTimeline,
};

export default meta;
type Story = StoryObj<typeof SospesoTimeline>;

export const Base: Story = {
  args: {
    status: ISSUED_SOSPESO["status"],
  },
};

export const Pending: Story = {
  args: {
    status: PENDING_SOSPESO["status"],
  },
};

export const Consumed: Story = {
  args: {
    status: CONSUMED_SOSPESO["status"],
  },
};
