import { SospesoApplyingForm } from "@/components/SospesoApplyingForm.tsx";
import { ISSUED_SOSPESO } from "@/sospeso/fixtures";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoApplyingForm> = {
  component: SospesoApplyingForm,
};

export default meta;
type Story = StoryObj<typeof SospesoApplyingForm>;

export const Base: Story = {
  args: {
    sospeso: ISSUED_SOSPESO,
  },
};
