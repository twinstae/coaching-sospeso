import { generateNanoId } from "@/adapters/generateId.ts";
import type { AccountItem, Transaction, TransactionItem } from "./domain.ts";

export const testTransactionId = generateNanoId();

export const 자산_현금_증감_80000원: TransactionItem = {
    id: generateNanoId(),
    target: { type: "asset" as const, name: "돈" as const },
    type: "증감" as const,
    amount: 80000,
}

export const 자본_기부금_증감_80000원: TransactionItem = {
  id: generateNanoId(),
  target: { type: "capital" as const, name: "기부금" as const },
  type: "증감" as const,
  amount: 80000,
}

export const 부채_증감_60000원: TransactionItem = {
    id: generateNanoId(),
    target: { type: "debt" as const, name: "코치-미지급금" as const },
    type: "증감" as const,
    amount: 60000,
}

export const testTransaction = {
  id: testTransactionId,
  description: "기부금 영수",
  left: [
    자산_현금_증감_80000원,
  ],
  right: [
    자본_기부금_증감_80000원,
  ],
} satisfies Transaction;

export const 현금_70000원: AccountItem = {
  id: "1",
  type: "asset" as const,
  name: "돈",
  amount: 70000,
  majorCategory: "유동자산",
  middleCategory: "현금및현금성자산",
  smallCategory: undefined,
};

export const 기부금_10000원: AccountItem = {
  id: "2",
  type: "capital" as const,
  name: "기부금",
  amount: 10000,
  majorCategory: "이익잉여금",
  middleCategory: "미지급금",
  smallCategory: undefined,
}

export const 코치_미지급금_60000원: AccountItem = {
  id: "5",
  type: "debt" as const,
  name: "코치-미지급금",
  amount: 60000,
  majorCategory: "유동부채",
  middleCategory: "미지급금",
  smallCategory: undefined
}

export const testAccount = [
  현금_70000원,
  기부금_10000원,
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
    id: "4",
    type: "capital" as const,
    name: "분담금",
    amount: 120000,
    majorCategory: "자본금",
    middleCategory: undefined,
    smallCategory: undefined
  },
  코치_미지급금_60000원
];