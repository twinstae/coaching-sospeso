import { SospesoCardList } from "@/components/SospesoCardList";
import { calcStatus } from "@/sospeso/domain";
import {
  pick,
  randomSospeso,
  TEST_SOSPESO_LIST_ITEM,
} from "@/sospeso/fixtures";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SospesoCardList> = {
  component: SospesoCardList,
};

export default meta;
type Story = StoryObj<typeof SospesoCardList>;

export const Base: Story = {
  args: {
    sospesoList: [TEST_SOSPESO_LIST_ITEM],
  },
};

const sospesoList = Array.from({ length: 10 }).map((_, _i) => {
  const sospeso = randomSospeso(
    pick(["issued", "consumed", "consumed", "pending"]),
  );

  return {
    ...sospeso,
    status: calcStatus(sospeso),
    issuedAt: sospeso.issuing.issuedAt,
  };
});

export const Ten: Story = {
  args: {
    sospesoList,
  },
};
