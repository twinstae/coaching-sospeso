import { SospesoDetail } from "@/components/SospesoDetail";
import {
  CONSUMED_SOSPESO,
  ISSUED_SOSPESO,
  PENDING_SOSPESO,
} from "@/sospeso/fixtures";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoDetail> = {
  component: SospesoDetail,
};

export default meta;
type Story = StoryObj<typeof SospesoDetail>;

export const Issued: Story = {
  args: {
    sospeso: ISSUED_SOSPESO,
  },
};

export const Pending: Story = {
  args: {
    sospeso: PENDING_SOSPESO,
  },
};

export const Consumed: Story = {
  args: {
    sospeso: CONSUMED_SOSPESO,
  },
};
