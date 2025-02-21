import type { Account } from "./domain";

export function deriveBalanceSheet(account: Account) {
    // asset은 최상위에 totalAmount 없이 각 분류별로만 집계됩니다.
    // debt와 capital은 debtAndCapital 객체 내부에 각각 totalAmount를 보유합니다.
    const result = {
      asset: {
        totalAmount: 0
      } as Record<string, any>,
      debtAndCapital: {
        totalAmount: 0,
        debt: { totalAmount: 0 } as Record<string, any>,
        capital: { totalAmount: 0 } as Record<string, any>,
      },
    };
  
    for (const acc of account) {
      // 대상 그룹 선택: asset, debt, capital
      let target: Record<string, any>;
      if (acc.type === "asset") {
        target = result.asset;
        target.totalAmount += acc.amount;
      } else if (acc.type === "debt") {
        target = result.debtAndCapital.debt;
        target.totalAmount += acc.amount;
        result.debtAndCapital.totalAmount += acc.amount
      } else if (acc.type === "capital") {
        target = result.debtAndCapital.capital;
        target.totalAmount += acc.amount;
        result.debtAndCapital.totalAmount += acc.amount
      } else {
        continue;
      }
  
      // majorCategory 집계
      if (!target[acc.majorCategory]) {
        target[acc.majorCategory] = { totalAmount: 0 };
      }
      target[acc.majorCategory].totalAmount += acc.amount;
  
      // middleCategory가 있을 경우
      if (acc.middleCategory) {
        if (!target[acc.majorCategory][acc.middleCategory]) {
          target[acc.majorCategory][acc.middleCategory] = { totalAmount: 0 };
        }
        target[acc.majorCategory][acc.middleCategory].totalAmount += acc.amount;
  
        // smallCategory가 있을 경우
        if (acc.smallCategory) {
          if (!target[acc.majorCategory][acc.middleCategory][acc.smallCategory]) {
            target[acc.majorCategory][acc.middleCategory][acc.smallCategory] = { totalAmount: 0 };
          }
          target[acc.majorCategory][acc.middleCategory][acc.smallCategory].totalAmount += acc.amount;
        }
      }
    }
    return result;
  }