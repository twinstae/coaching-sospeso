import { describe, expect, test } from "vitest";
import { applyTransaction, 양변이_같다, type Account } from "./domain.ts";

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
const transaction = {
  left: [
    {
      target: { type: "asset" as const, id: "돈" as const },
      type: "증가" as const,
      amount: 80000,
    },
  ],
  right: [
    {
      target: { type: "capital" as const, id: "기부금" as const },
      type: "증가" as const,
      amount: 80000,
    },
  ],
};

describe("accounting", () => {
  test("누군가 기부를 하면 자산도 늘어나고, 자본도 늘어난다", () => {
    // given 어떤 상태였는데
    const initState = [
      {
        type: "asset" as const,
        id: "돈",
        amount: 10000,
      },
      {
        type: "capital" as const,
        id: "기부금",
        amount: 10000,
      },
    ];

    const result = applyTransaction(initState, transaction);

    // then 어떻게 상태가 변한다~
    expect(result).toStrictEqual([
      {
        type: "asset",
        id: "돈",
        amount: 90000,
      },
      {
        type: "capital",
        id: "기부금",
        amount: 90000,
      },
    ]);
  });

  const invalidAccount = [
    {
      type: "asset",
      id: "돈",
      amount: 90000,
    },
    {
      type: "capital",
      id: "기부금",
      amount: 90001,
    },
  ] as Account;

  test("양변이 다르면 안 된다", () => {
    expect(양변이_같다(invalidAccount)).toBe(false);
  });

  test("양변이 같으면 괜찮다", () => {
    const validAccount = [
      {
        type: "asset",
        id: "돈",
        amount: 160000,
      },
      {
        type: "capital",
        id: "기부금",
        amount: 40000,
      },
      {
        type: "debt",
        id: "코칭-미지급금",
        amount: 120000,
      },
    ] as Account;

    expect(양변이_같다(validAccount)).toBe(true);
  });

  test("잘못된 account에 트랜잭션을 걸려하면 에러가 난다", () => {
    expect(() => applyTransaction(invalidAccount, transaction))
      .toThrowError("트랜잭션을 시작하기 전에 양변이 같아야 합니다");
  });
});
