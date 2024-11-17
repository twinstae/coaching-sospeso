import { describe, expect, test } from "vitest";
import { completePayment, createSospesoIssuingPayment, isPaid } from "./domain";
import { EXAMPLE_PAYMENT_PAYLOAD } from "./fixtures";

const TEST_PAYMENT_ID = "eaT72utJOlX_16";
const NOW = new Date("2024-11-14T00:00:00Z");

describe("payment", () => {
  test("새로운 소스페소 발행 결제를 생성할 수 있다", () => {
    const payment = createSospesoIssuingPayment({
      sospesoId: TEST_PAYMENT_ID,
      now: NOW,
    });

    expect(payment).toStrictEqual({
      afterLinkUrl: "http://localhost:3000/sospeso/eaT72utJOlX_16",
      expiredDate: new Date("2024-11-15T00:00:00Z"),
      goodsDescription:
        "1시간 반에서 2시간의 코칭을 수혜자에게 제공하는 소스페소를 구매합니다.",
      goodsTitle: "코칭 소스페소 1장",
      id: TEST_PAYMENT_ID,
      params: {
        sospesoId: TEST_PAYMENT_ID,
      },
      paymentTotalAmount: 0,
      status: "initiated",
    });
  });

  test("결제를 완료할 수 있다", () => {
    const payment = createSospesoIssuingPayment({
      sospesoId: TEST_PAYMENT_ID,
      now: NOW,
    });

    const result = completePayment(payment, EXAMPLE_PAYMENT_PAYLOAD);
    expect(result).toStrictEqual({
      afterLinkUrl: "http://localhost:3000/sospeso/eaT72utJOlX_16",
      expiredDate: new Date("2024-11-15T00:00:00Z"),
      goodsDescription:
        "1시간 반에서 2시간의 코칭을 수혜자에게 제공하는 소스페소를 구매합니다.",
      goodsTitle: "코칭 소스페소 1장",
      id: TEST_PAYMENT_ID,
      params: {
        sospesoId: TEST_PAYMENT_ID,
      },
      paymentTotalAmount: 0,
      status: "paid",
      paymentResult: EXAMPLE_PAYMENT_PAYLOAD,
    });

    expect(isPaid(result)).toBe(true);
  });
});
