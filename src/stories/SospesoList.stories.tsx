import { SospesoList } from "@/components/SospesoList";
import { TEST_SOSPESO_LIST_ITEM } from "@/sospeso/fixtures";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoList> = {
  component: SospesoList,
};

export default meta;
type Story = StoryObj<typeof SospesoList>;

export const Base: Story = {
  args: {
    sospesoList: [TEST_SOSPESO_LIST_ITEM],
  },
};
