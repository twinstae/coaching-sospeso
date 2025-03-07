import { describe, expect, test } from "vitest";
import { applyTransaction, calcTotalAsset, calcTotalCapital, calcTotalDebt, 양변이_같다, type Account, type Transaction } from "./domain.ts";
import { testAccount, testTransaction, 기부금_10000원, 부채_증감_60000원, 자산_현금_증감_80000원, 코치_미지급금_60000원, 현금_70000원 } from "./fixtures.ts";

describe("accounting domain", () => {
  test("누군가 기부를 하면 자산도 늘어나고, 자본도 늘어난다", () => {
    // given 어떤 상태였는데
    const initState = [
      {
        ...현금_70000원,
        amount: 10000,
      },
      {
        ...기부금_10000원,
        amount: 10000,
      },
    ] satisfies Account;

    const result = applyTransaction(initState, testTransaction);

    // then 어떻게 상태가 변한다~
    expect(result).toStrictEqual([
      {
        ...현금_70000원,
        amount: 90000,
      },
      {
        ...기부금_10000원,
        amount: 90000
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
    const validAccount: Account = [
      {
        ...현금_70000원,
        amount: 160000,
      },
      {
        ...기부금_10000원,
        amount: 40000
      },
      {
        ...코치_미지급금_60000원,
        amount: 120000
      }
    ];

    expect(양변이_같다(validAccount)).toBe(true);
  });

  test("잘못된 account에 트랜잭션을 걸려하면 에러가 난다", () => {
    expect(() => applyTransaction(invalidAccount, testTransaction)).toThrowError(
      "트랜잭션을 시작하기 전에 양변이 같아야 합니다",
    );
  });

  test("코치에게 돈을 정산해주면, 자산도 감소하고, 부채도 감소한다.", () => {
    // given 원래 돈도 있고 코치에게 줄 미지급금(부채)도 있었는데
    const initState = [
      {
        ...현금_70000원,
        amount: 130000,
      },
      {
        ...기부금_10000원,
        amount: 10000
      },
      {
        ...코치_미지급금_60000원,
        amount: 120000
      }
    ] satisfies Account;

    
    // when 부채를 갚으면
    const transaction = {
      left: [
        {
        ...자산_현금_증감_80000원,
        amount: -60000
        }
      ],
      right: [
        {
          ...부채_증감_60000원,
          amount: -60000
        }
      ],
    } as Transaction;

    const result = applyTransaction(initState, transaction);

    // then 자산도 줄어들고 부채도 줄어들어야한다
    expect(result).toStrictEqual([
      현금_70000원,
      기부금_10000원,
      코치_미지급금_60000원
    ]);
  });

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
