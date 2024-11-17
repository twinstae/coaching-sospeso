import invariant from "@/invariant.ts";
import type { PaymentT } from "./domain.ts";

export interface PaymentRepositoryI {
  updateOrSave(
    paymentId: string,
    update: (payment: PaymentT | undefined) => PaymentT,
  ): Promise<void>;
  retrievePayment(paymentId: string): Promise<PaymentT>;
}

export const createFakePaymentRepository = (
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
    async retrievePayment(paymentId) {
      const result = _fakeState[paymentId];
      invariant(result, "결제가 존재하지 않습니다! : " + paymentId);

      return result;
    },
  } satisfies PaymentRepositoryI;
};
