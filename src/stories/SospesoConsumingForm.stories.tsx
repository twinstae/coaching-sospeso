import { SospesoConsumingForm } from "@/components/SospesoConsumingForm.tsx";
import { TEST_COACH_LIST } from "@/sospeso/fixtures";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoConsumingForm> = {
  component: SospesoConsumingForm,
};

export default meta;
type Story = StoryObj<typeof SospesoConsumingForm>;

export const Base: Story = {
  args: {
    coachList: TEST_COACH_LIST,
  },
};
