import { SospesoIssuingForm } from "@/components/SospesoIssuingForm";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoIssuingForm> = {
  component: SospesoIssuingForm,
};

export default meta;
type Story = StoryObj<typeof SospesoIssuingForm>;

export const Base: Story = {
  args: {
    onSubmit: async (command) => {
      alert(JSON.stringify(command));
    },
  },
};
