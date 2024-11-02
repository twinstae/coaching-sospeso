import type { Meta, StoryObj } from "@storybook/react";

import Counter from "../shared/components/Counter";

const meta: Meta<typeof Counter> = {
  component: Counter,
};

export default meta;
type Story = StoryObj<typeof Counter>;

export const Primary: Story = {
  args: {
    primary: true,
    label: "Counter",
  },
};
