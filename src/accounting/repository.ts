import type { Account } from "./domain";

export interface AccountRepositoryI {
  updateOrSave(
    accountId: string,
    update: (account: Account | undefined) => Account,
  ): Promise<void>;
  getOneById(accountId: string): Promise<Account | undefined>;
}

export const createFakeAccountRepository = (
  initState: Record<string, Account> = {},
): AccountRepositoryI => {
  let _fakeState = structuredClone(initState);

  return {
    async updateOrSave(
      accountId: string,
      update: (account: Account | undefined) => Account,
    ): Promise<void> {
      _fakeState[accountId] = update(_fakeState[accountId]);
    },
    async getOneById(accountId: string) {
        return _fakeState[accountId]
    }
  };
};
