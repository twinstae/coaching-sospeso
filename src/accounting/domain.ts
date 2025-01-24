import invariant from '@/invariant';

// 항목?
export type Account = {
  type: "asset" | "capital" | "debt";
  id: string;
  amount: number;
}[];

export type Transaction = {
  left: {
    target: {
      type: "asset";
      id: "돈";
    };
    type: "증가"; // 증감, 생김, 사라짐
    amount: number;
  }[];
  right: {
    target: {
      type: "capital";
      id: "기부금";
    };
    type: "증가"; // 증감, 생김, 사라짐
    amount: number;
  }[];
};

function sum(arr: number[]) {
  let total = 0;
  for (const n of arr) {
    total += n;
  }
  return total;
}

// invariant
export function 양변이_같다(account: Account): boolean {
  // 총 자산의 합 = 자산인 것들만의 amount의 합
  const totalAssetAmount = sum(
    account.filter((item) => item.type === "asset").map((item) => item.amount),
  );
  // 자산만 걸러내기
  // amount 만 빼내서
  // 합해야 함

  // 총 자본의 합
  const totalCapitalAmount = sum(
    account
      .filter((item) => item.type === "capital")
      .map((item) => item.amount),
  );

  // 총 부채의 합
  const totalDebtAmount = sum(
    account
      .filter((item) => item.type === "debt")
      .map((item) => item.amount),
  );

  // 둘이 같은가?
  return totalAssetAmount === totalCapitalAmount + totalDebtAmount;
}

// 동사
export function applyTransaction(
  account: Account,
  transaction: Transaction,
): Account {
  invariant(양변이_같다(account), "트랜잭션을 시작하기 전에 양변이 같아야 합니다")

  const result = transaction.left
    .concat(transaction.right as any)
    .reduce((acc, action) => {
      if (action.type === "증가") {
        return acc.map((item) => {
          // 증가된 항목의 amount를 증가시킨다
          if (
            item.type === action.target.type &&
            item.id === action.target.id
          ) {
            return {
              ...item,
              amount: item.amount + action.amount,
            };
          }

          // 대상이 아니면 그대로 둔다
          return item;
        });
      }

      // type이 증가가 아닌 경우는 없다!
      throw Error("unreachable!");
    }, account);

  invariant(양변이_같다(result), "트랜잭션이 끝난 후에 양변이 같아야 합니다")

  return result;
}
