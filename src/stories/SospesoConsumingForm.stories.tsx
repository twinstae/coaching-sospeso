import { SospesoConsumingForm } from "@/components/SospesoConsumingForm.tsx";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoConsumingForm> = {
  component: SospesoConsumingForm,
};

export default meta;
type Story = StoryObj<typeof SospesoConsumingForm>;

export const Base: Story = {
  args: {
    onSubmit: async (command) => {
      alert(JSON.stringify(command));
    },
  },
};
