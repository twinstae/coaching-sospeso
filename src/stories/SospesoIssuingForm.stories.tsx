import { SospesoIssuingForm } from "@/components/SospesoIssuingForm.tsx";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoIssuingForm> = {
  component: SospesoIssuingForm,
};

export default meta;
type Story = StoryObj<typeof SospesoIssuingForm>;

export const Base: Story = {
  args: {
    userNickname: "김토끼",
  },
};
