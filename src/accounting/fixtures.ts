import { generateNanoId } from "@/adapters/generateId.ts";
import type { Transaction } from "./domain.ts";

export const testTransactionId = generateNanoId();
export const testTransaction = {
  id: testTransactionId,
  description: "기부금 영수",
  left: [
    {
      id: generateNanoId(),
      target: { type: "asset" as const, name: "돈" as const },
      type: "증감" as const,
      amount: 80000,
    },
  ],
  right: [
    {
      id: generateNanoId(),
      target: { type: "capital" as const, name: "기부금" as const },
      type: "증감" as const,
      amount: 80000,
    },
  ],
} satisfies Transaction;


export const testAccount = [
  {
    id: "1",
    type: "asset" as const,
    name: "돈",
    amount: 70000,
    majorCategory: "유동자산",
    middleCategory: "현금및현금성자산",
  },
  {
    id: "2",
    type: "asset" as const,
    name: "라즈베리파이",
    amount: 120000,
    majorCategory: "비유동자산",
    middleCategory: "유형자산",
    smallCategory: "기계장치",
  },

  {
    id: "3",
    type: "capital" as const,
    name: "기부금",
    amount: 10000,
    majorCategory: "이익잉여금",
  },
  {
    id: "4",
    type: "capital" as const,
    name: "분담금",
    amount: 120000,
    majorCategory: "자본금",
  },

  {
    id: "5",
    type: "debt" as const,
    name: "코치-미지급금",
    amount: 60000,
    majorCategory: "유동부채",
    middleCategory: "미지급금",
  }
];