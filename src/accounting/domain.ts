import invariant from '@/invariant.ts';

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
    type: "증감"; // 증감, 생김, 사라짐짐
    amount: number;
  }[];
  right: {
    target: {
      type: "capital";
      id: "기부금";
    } | {
      type: "debt";
      id: "코치-미지급금";
    };
    type: "증감"; // 증감, 생김, 사라짐짐
    amount: number;
  }[];
} ;

function sum(arr: number[]) {
  return arr.reduce((total, n) => total + n, 0);
}

export function calcTotalAsset(account: Account): number {
  return sum(
    account.filter((item) => item.type === "asset").map((item) => item.amount),
  );
}
export function calcTotalCapital(account: Account): number {
  return sum(
    account.filter((item) => item.type === "capital").map((item) => item.amount),
  );
}
export function calcTotalDebt(account: Account): number {
  return sum(
    account.filter((item) => item.type === "debt").map((item) => item.amount),
  );
}

// invariant
export function 양변이_같다(account: Account): boolean {
  const totalAssetAmount = calcTotalAsset(account);
  const totalCapitalAmount = calcTotalCapital(account);
  const totalDebtAmount = calcTotalDebt(account);
  
  return totalAssetAmount === totalCapitalAmount + totalDebtAmount;
}

// 동사
export function applyTransaction(account: Account, transaction: Transaction): Account {
  invariant(양변이_같다(account), "트랜잭션을 시작하기 전에 양변이 같아야 합니다");

  const result = [...transaction.left, ...transaction.right].reduce((acc, action) => {
    if (action.type === "증감") {
      return acc.some((item) => item.type === action.target.type && item.id === action.target.id)
        ? acc.map((item) =>
            item.type === action.target.type && item.id === action.target.id
              ? { ...item, amount: item.amount + action.amount }
              : item
          )
        : [...acc, { type: action.target.type, id: action.target.id, amount: action.amount }];
    }

    // 예외 처리 강화
    invariant(false, "지원하지 않는 트랜잭션 타입입니다.");
  }, account);

  invariant(양변이_같다(result), "트랜잭션이 끝난 후에 양변이 같아야 합니다");

  return result;
}
