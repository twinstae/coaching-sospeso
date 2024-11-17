import type { PaymentT } from './domain.ts';

export interface PaymentRepositoryI {
  updateOrSave(
    paymentId: string,
    update: (payment: PaymentT | undefined) => PaymentT,
  ): Promise<void>;
}

export const createFakeRepository = (
  initState: Record<string, PaymentT> = {},
): PaymentRepositoryI => {
  let _fakeState = initState;

  return {
    async updateOrSave(
      paymentId: string,
      update: (payment: PaymentT | undefined) => PaymentT,
    ): Promise<void> {
      _fakeState[paymentId] = update(_fakeState[paymentId]);
    },
  } satisfies PaymentRepositoryI;
};
