import { describe, expect, test } from "vitest";
import { cancelPayment, completePayment, createSospesoIssuingPayment, isPaid } from "./domain";
import { EXAMPLE_PAYMENT_PAYLOAD } from "./fixtures";
import { TEST_SOSPESO_ID, TEST_SOSPESO_LIST_ITEM } from "@/sospeso/fixtures";
import { TEST_USER_ID } from "@/auth/fixtures";

const TEST_PAYMENT_ID = "eaT72utJOlX_16";
const NOW = new Date("2024-11-14T00:00:00Z");

const SOSPESO_ISSUING_COMMAND = {
  sospesoId: TEST_SOSPESO_ID,
  issuedAt: TEST_SOSPESO_LIST_ITEM.issuedAt,
  from: TEST_SOSPESO_LIST_ITEM.from,
  to: TEST_SOSPESO_LIST_ITEM.to,
  issuerId: TEST_USER_ID,
  paidAmount: 80000,
};

describe("payment", () => {
  test("새로운 소스페소 발행 결제를 생성할 수 있다", () => {
    const payment = createSospesoIssuingPayment({
      sospesoId: TEST_PAYMENT_ID,
      now: NOW,
      totalAmount: 80000,
      command: SOSPESO_ISSUING_COMMAND,
    });

    expect(payment).toStrictEqual({
      afterLinkUrl: "http://localhost:4321/sospeso/DaLNnQs8nfVgs0",
      expiredDate: new Date("2024-11-15T00:00:00Z"),
      goodsDescription:
        "1시간 반에서 2시간의 코칭을 수혜자에게 제공하는 소스페소를 구매합니다.",
      goodsTitle: "코칭 소스페소 1장",
      id: TEST_PAYMENT_ID,
      command: SOSPESO_ISSUING_COMMAND,
      totalAmount: 80000,
      status: "initiated",
    });
  });

  test("결제를 완료할 수 있다", () => {
    const payment = createSospesoIssuingPayment({
      sospesoId: TEST_PAYMENT_ID,
      now: NOW,
      totalAmount: 80000,
      command: SOSPESO_ISSUING_COMMAND,
    });

    const result = completePayment(payment, EXAMPLE_PAYMENT_PAYLOAD);
    expect(result).toStrictEqual({
      afterLinkUrl: "http://localhost:4321/sospeso/DaLNnQs8nfVgs0",
      expiredDate: new Date("2024-11-15T00:00:00Z"),
      goodsDescription:
        "1시간 반에서 2시간의 코칭을 수혜자에게 제공하는 소스페소를 구매합니다.",
      goodsTitle: "코칭 소스페소 1장",
      id: TEST_PAYMENT_ID,
      command: SOSPESO_ISSUING_COMMAND,
      totalAmount: 80000,
      status: "paid",
      paymentResult: EXAMPLE_PAYMENT_PAYLOAD,
    });

    expect(isPaid(result)).toBe(true);
  });

  test("결제를 취소할 수 있다", () => {
    const payment = createSospesoIssuingPayment({
      sospesoId: TEST_PAYMENT_ID,
      now: NOW,
      totalAmount: 80000,
      command: SOSPESO_ISSUING_COMMAND,
    });
    const paidPayment = completePayment(payment, EXAMPLE_PAYMENT_PAYLOAD);
    const result = cancelPayment(paidPayment, EXAMPLE_PAYMENT_PAYLOAD);
    expect(result.status).toStrictEqual("cancelled");
  });
});
