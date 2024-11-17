import { env } from '@/adapters/env';
import { href } from '@/routing/href';
import { addHours } from 'date-fns/addHours';

export type PaymentT = {
    id: string;
    status: "initiated" | "paid"
    goodsTitle: string; // 상품 이름
    goodsDescription: string; // 상품 설명
    paymentTotalAmount: number; // 상품의 가격
    expiredDate: Date; // 링크 만료 일시
    params: Record<string, string>; // 추가로 제공할 파라미터
    afterLinkUrl: string; // 결제 완료 후 이동할 URL
};

const EXPIRE_TIME_IN_HOURS = 24;

export function createSospesoIssuingPayment(command: { sospesoId: string, now: Date }): PaymentT {
    return {
        id: command.sospesoId,
        status: "initiated",
        goodsTitle: "코칭 소스페소 1장",
        goodsDescription: "1시간 반에서 2시간의 코칭을 수혜자에게 제공하는 소스페소를 구매합니다.",
        paymentTotalAmount: 0,
        expiredDate: addHours(command.now, EXPIRE_TIME_IN_HOURS),
        params: {},
        afterLinkUrl: `${env.APP_HOST}${href("소스페소-상세", { sospesoId: command.sospesoId })}`
    } satisfies PaymentT
}

export function completePayment(payment: PaymentT): PaymentT {

    return {
        ...payment,
        status: 'paid'
    }
}