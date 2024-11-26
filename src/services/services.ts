import { issueSospeso, type SospesoIssuingCommand } from "@/sospeso/domain";
import type { SospesoRepositoryI } from "@/sospeso/repository";
import type { PaymentRepositoryI } from "@/payment/repository";
import { cancelPayment, completePayment, isPaid } from "@/payment/domain";
import invariant from "@/invariant";

export function createSospesoServices(sospesoRepo: SospesoRepositoryI) {
  return {
    issueSospeso: async (command: SospesoIssuingCommand) => {
      await sospesoRepo.updateOrSave(command.sospesoId, () => {
        const issuedSospeso = issueSospeso(command);

        return issuedSospeso;
      });
    },
  };
}

export function createPaymentServices(paymentRepo: PaymentRepositoryI) {
  return {
    completePayment: async (paymentId: string, paymentResult: Record<string, string>) => {
      await paymentRepo.updateOrSave(paymentId, (payment) => {
        invariant(payment, "결제가 존재하지 않습니다!");
        return completePayment(payment, paymentResult);
      });
    },
    cancelPayment: async (paymentId: string) => {
      await paymentRepo.updateOrSave(paymentId, (payment) => {
        invariant(payment, "결제가 존재하지 않습니다!");
        invariant(isPaid(payment), "결제가 완료되어야 취소할 수 있어요!");
        return cancelPayment(payment);
      });
    }
  };
}
