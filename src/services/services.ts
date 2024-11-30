import invariant from "@/invariant";
import { cancelPayment, completePayment, isPaid } from "@/payment/domain";
import type { PaymentRepositoryI } from "@/payment/repository";
import { SOSPESO_PRICE } from "@/sospeso/constants";
import { issueSospeso, type SospesoIssuingCommand } from "@/sospeso/domain";
import type { SospesoRepositoryI } from "@/sospeso/repository";

export function createSospesoServices({
  sospesoRepo,
  paymentRepo,
}: {
  sospesoRepo: SospesoRepositoryI;
  paymentRepo: PaymentRepositoryI;
}) {
  return {
    completeSospesoPayment: async (input: {
      paymentId: string;
      paymentResult: Record<string, string>;
    }) => {
      await paymentRepo.updateOrSave(input.paymentId, (payment) => {
        invariant(payment, "결제가 존재하지 않습니다! : " + input.paymentId);
        invariant(payment.status === "initiated", "이미 결제가 완료되었어요");
        return completePayment(payment, input.paymentResult);
      });

      const payment = await paymentRepo.retrievePayment(input.paymentId);

      return {
        type: "paymentComplete",
        payload: payment.command,
      };
    },
    cancelSospesoPayment: async ({
      sospesoId: paymentId,
    }: {
      sospesoId: string;
    }) => {
      await paymentRepo.updateOrSave(paymentId, (payment) => {
        invariant(payment, "결제가 존재하지 않습니다! : " + paymentId);
        invariant(isPaid(payment), "결제가 완료되어야 취소할 수 있어요!");

        return cancelPayment(payment);
      });
    },
    issueSospeso: async (command: SospesoIssuingCommand) => {
      await sospesoRepo.updateOrSave(command.sospesoId, (sospeso) => {
        invariant(sospeso === undefined, "이미 발행이 완료된 소스페소입니다!");
        return issueSospeso({
          sospesoId: command.sospesoId,
          issuedAt: command.issuedAt,
          from: command.from,
          to: command.to,
          issuerId: command.issuerId,
          paidAmount: SOSPESO_PRICE,
        });
      });
    },
  };
}
