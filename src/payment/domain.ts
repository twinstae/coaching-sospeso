import { env } from "@/adapters/env";
import { href } from "@/routing/href";
import type { SospesoIssuingCommand } from "@/sospeso/domain";
import { addHours } from "date-fns/addHours";

export type PaidPayment = {
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

export type CancelledPayment = {
  id: string;
  status: "cancelled";
  goodsTitle: string; // 상품 이름
  goodsDescription: string; // 상품 설명
  totalAmount: number; // 상품의 가격
  expiredDate: Date; // 링크 만료 일시
  command: any;
  afterLinkUrl: string; // 결제 완료 후 이동할 URL
  paymentResult: Record<string, string>; // 결제 결과 원본
};

export type Payment =
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
  | PaidPayment
  | CancelledPayment;

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
}): Payment {
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
  } satisfies Payment;
}

export function completePayment(
  payment: Payment,
  paymentResult: Record<string, string>,
): PaidPayment {
  return {
    ...payment,
    status: "paid",
    paymentResult,
  } satisfies PaidPayment;
}

export function cancelPayment(
  paidPayment: PaidPayment,
): CancelledPayment {
  return {
    ...paidPayment,
    status: "cancelled",
  } satisfies CancelledPayment;
}

export function isPaid(payment: Payment): payment is PaidPayment {
  return payment.status === "paid";
}

export function isCancelled(payment: Payment): payment is CancelledPayment {
  return payment.status === "cancelled";
}
