import { env } from "@/adapters/env";
import { href } from "@/routing/href";
import type { SospesoIssuingCommand } from "@/sospeso/domain";
import { addHours } from "date-fns/addHours";

export type PaidPaymentT = {
  id: string;
  status: "paid";
  goodsTitle: string; // 상품 이름
  goodsDescription: string; // 상품 설명
  totalAmount: number; // 상품의 가격
  expiredDate: Date; // 링크 만료 일시
  command: any;
  afterLinkUrl: string; // 결제 완료 후 이동할 URL
  paymentResult: Record<string, string>; // 결제 결과 원본
};

export type PaymentT =
  | {
      id: string;
      status: "initiated";
      goodsTitle: string; // 상품 이름
      goodsDescription: string; // 상품 설명
      totalAmount: number; // 상품의 가격
      expiredDate: Date; // 링크 만료 일시
      command: any;
      afterLinkUrl: string; // 결제 완료 후 이동할 URL
    }
  | PaidPaymentT;

const EXPIRE_TIME_IN_HOURS = 24;

export function createSospesoIssuingPayment({
  sospesoId,
  now,
  totalAmount,
  command,
}: {
  sospesoId: string;
  now: Date;
  totalAmount: number;
  command: SospesoIssuingCommand;
}): PaymentT {
  return {
    id: sospesoId,
    status: "initiated",
    goodsTitle: "코칭 소스페소 1장",
    goodsDescription:
      "1시간 반에서 2시간의 코칭을 수혜자에게 제공하는 소스페소를 구매합니다.",
    totalAmount,
    expiredDate: addHours(now, EXPIRE_TIME_IN_HOURS),
    command,
    afterLinkUrl: `${env.APP_HOST}${href("소스페소-상세", { sospesoId: command.sospesoId })}`,
  } satisfies PaymentT;
}

export function completePayment(
  payment: PaymentT,
  paymentResult: Record<string, string>,
): PaidPaymentT {
  return {
    ...payment,
    status: "paid",
    paymentResult,
  } satisfies PaidPaymentT;
}

export function isPaid(payment: PaymentT): payment is PaidPaymentT {
  return payment.status === "paid";
}
