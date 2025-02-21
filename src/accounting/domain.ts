import invariant from '@/invariant.ts';

type AccontItem = {
  id: string;
  type: "asset" | "capital" | "debt";
  name: string;
  amount: number;
  majorCategory: string;
  middleCategory?: string;
  smallCategory?: string;
};

// 항목?
export type Account = AccontItem[];

export type Transaction = {
  id: string,
  description: string,
  left: {
    id: string,
    target: {
      type: "asset";
      name: string;
    };
    type: "증감"; // 증감, 생김, 사라짐짐
    amount: number;
  }[];
  right: {
    id: string,
    target: {
      type: "capital";
      name: string;
    } | {
      type: "debt";
      name: string;
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

  const result = [...transaction.left, ...transaction.right].reduce((acc, transactionItem) => {
    if (transactionItem.type === "증감") {
       invariant(acc.some((item) => item.type === transactionItem.target.type && item.name === transactionItem.target.name), "트랜잭션에 대상이 없습니다")
       return acc.map((item) =>
            item.type === transactionItem.target.type && item.name === transactionItem.target.name
              ? { ...item, amount: item.amount + transactionItem.amount }
              : item
          )
    }

    // 예외 처리 강화
    invariant(false, "지원하지 않는 트랜잭션 타입입니다.");
  }, account);

  invariant(양변이_같다(result), "트랜잭션이 끝난 후에 양변이 같아야 합니다");

  return result;
}
