import invariant from "@/invariant";
import { applyTransaction, type Account, type Transaction } from "./domain";

export interface AccountRepositoryI {
  transact(
    accountId: string,
    transaction: Transaction,
  ): Promise<void>;
  getOneById(accountId: string): Promise<Account | undefined>;
}

export const createFakeAccountRepository = (
  initState: Record<string, Account> = {},
): AccountRepositoryI => {
  let _fakeState = structuredClone(initState);

  return {
    async transact(
      accountId: string,
      transaction: Transaction,
    ): Promise<void> {
      
      const old = _fakeState[accountId];
      invariant(old, "계좌가 존재하지 않습니다!");

      _fakeState[accountId] = applyTransaction(old, transaction);
    },
    async getOneById(accountId: string) {
        return _fakeState[accountId]
    }
  };
};
