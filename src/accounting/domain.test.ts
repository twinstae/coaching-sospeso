import { describe, expect, test } from "vitest";
import { applyTransaction, calcTotalAsset, calcTotalCapital, calcTotalDebt, 양변이_같다, type Account, type Transaction } from "./domain.ts";
import { generateNanoId } from "@/adapters/generateId.ts";

// (이벤트 소싱)

// 트랜잭션

// 자산의 취득이나 소멸이 여러 개 있을 수 있음

// 자본이랑, 부채도 마찬가지

// 자산의 증감의 합과 = 자본과 부채의 증감의 합과 같아야 함 (불변식 invariant)

// 파생 상태 (getter, computed, derived)

// 자산 => 현금, 유형자산, 무형자산 (모든 것으로 돈으로 환원된다)

// 자본 => 코칭비를 낸 것 + 기부(매출) 분담금(이익x)

// 부채 => 미지급한 돈…(수수료, 코칭비를 아직 안 줌…)

// 코칭비 매출 = 코칭비 합 => 영업을 해서 얻은 매출

// 기부금 매출 = 기부금 합 => 영업을 해서 얻은 매출

// 매출 = 분담금이 아닌… 자본 증가의 합

// 비용 = 현금 자산의 감소 = 사무실 비용, 수수료, 파이 구매, 코칭비 준 것…

// 이익 = 매출 + 자산의 취득 - 비용 (이익이 마이너스면 손해)

// 자산의 증가 -> 자산이 새로운 자산이 생김, 기존 자산의 가치가 늘어남
// 자산의 감소 -> 있는 자산이 사라짐, 기존 자산의 가치가 줄어듬

// when 뭘 하면
const testTransactionId = generateNanoId();
const transaction = {
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

describe("accounting", () => {
  test("누군가 기부를 하면 자산도 늘어나고, 자본도 늘어난다", () => {
    // given 어떤 상태였는데
    const initState = [
      {
        id: "1",
        type: "asset" as const,
        name: "돈",
        amount: 10000,
      },
      {
        id: "2",
        type: "capital" as const,
        name: "기부금",
        amount: 10000,
      },
    ] satisfies Account;

    const result = applyTransaction(initState, transaction);

    // then 어떻게 상태가 변한다~
    expect(result).toStrictEqual([
      {
        id: "1",
        type: "asset",
        name: "돈",
        amount: 90000,
      },
      {
        id: "2",
        type: "capital",
        name: "기부금",
        amount: 90000,
      },
    ]);
  });

  const invalidAccount = [
    {
      id: "1",
      type: "asset",
      name: "돈",
      amount: 90000,
    },
    {
      id: "2",
      type: "capital",
      name: "기부금",
      amount: 90001,
    },
  ] as Account;

  test("양변이 다르면 안 된다", () => {
    expect(양변이_같다(invalidAccount)).toBe(false);
  });

  test("양변이 같으면 괜찮다", () => {
    const validAccount = [
      {
        id: "1",
        type: "asset",
        name: "돈",
        amount: 160000,
      },
      {
        id: "2",
        type: "capital",
        name: "기부금",
        amount: 40000,
      },
      {
        id: "3",
        type: "debt",
        name: "코칭-미지급금",
        amount: 120000,
      },
    ] as Account;

    expect(양변이_같다(validAccount)).toBe(true);
  });

  test("잘못된 account에 트랜잭션을 걸려하면 에러가 난다", () => {
    expect(() => applyTransaction(invalidAccount, transaction)).toThrowError(
      "트랜잭션을 시작하기 전에 양변이 같아야 합니다",
    );
  });

  test("코치에게 돈을 정산해주면, 자산도 감소하고, 부채도 감소한다.", () => {
    // given 원래 돈도 있고 코치에게 줄 미지급금(부채)도 있었는데
    const initState = [
      {
        id: "1",
        type: "asset" as const,
        name: "돈",
        amount: 130000,
      },
      {
        id: "2",
        type: "capital" as const,
        name: "기부금",
        amount: 10000,
      },
      {
        id: "3",
        type: "debt" as const,
        name: "코치-미지급금",
        amount: 120000,
      }
    ] satisfies Account;

    
    // when 부채를 갚으면
    const transaction = {
      left: [
        {
          target: { type: "asset" as const, name: "돈" as const },
          type: "증감" as const,
          amount: -60000,
        },
      ],
      right: [
        {
          target: { type: "debt" as const, name: "코치-미지급금" as const },
          type: "증감" as const,
          amount: -60000,
        },
      ],
    } as Transaction;

    const result = applyTransaction(initState, transaction);

    // then 자산도 줄어들고 부채도 줄어들어야한다
    expect(result).toStrictEqual([
      {
        id: "1",
        type: "asset" as const,
        name: "돈",
        amount: 70000,
      },
      {
        id: "2",
        type: "capital" as const,
        name: "기부금",
        amount: 10000,
      },
      {
        id: "3",
        type: "debt" as const,
        name: "코치-미지급금",
        amount: 60000,
      }
    ]);
  });

  const testAccount = [
    {
      id: "1",
      type: "asset" as const,
      name: "돈",
      amount: 70000,
    },
    {
      id: "2",
      type: "asset" as const,
      name: "라즈베리파이",
      amount: 120000,
    },

    {
      id: "3",
      type: "capital" as const,
      name: "기부금",
      amount: 10000,
    },
    {
      id: "4",
      type: "capital" as const,
      name: "분담금",
      amount: 120000,
    },

    {
      id: "5",
      type: "debt" as const,
      name: "코치-미지급금",
      amount: 60000,
    }
  ];


  test("현재 총 자산을 알 수 있다", () => {
    // 총 자산 => 190000 원
    expect(calcTotalAsset(testAccount)).toBe(190000)
  })

  // 모든 자본의 합을 알 수 있다
  test("현재 총 자본을 알 수 있다", () => {
    // 총 자산 => 130000 원 기부금+분담금
    expect(calcTotalCapital(testAccount)).toBe(130000)
  })

  // 모든 부채의 합을 알 수 있다
  test("현재 총 부채를 알 수 있다", () => {
    // 총 자산 => 60000 원 기부금+분담금
    expect(calcTotalDebt(testAccount)).toBe(60000)
  })
});
