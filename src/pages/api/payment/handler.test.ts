import { describe, expect, test } from "vitest";
import { createSospesoIssuingPayment } from "../../../payment/domain";
import { TEST_SOSPESO_LIST_ITEM } from "../../../sospeso/fixtures";
import { EXAMPLE_WEBHOOK_PAYLOAD } from "../../../payment/fixtures";
import { createFakePaymentRepository } from "@/payment/repository";
import { TEST_USER_ID } from "@/auth/fixtures";
import { TEST_NOW } from "@/actions/fixtures";
import { createFakeSospesoRepository } from "@/sospeso/repository";
import { createHandler } from "./handler";

describe("PaymentHandler", () => {
  const TEST_ID = "good_first_customer";

  test("결제완료 웹훅을 받으면 소스페소를 발행한다", async () => {
    const payment = createSospesoIssuingPayment({
      sospesoId: TEST_ID,
      now: TEST_NOW,
      totalAmount: 80000,
      command: {
        sospesoId: TEST_ID,
        issuedAt: TEST_NOW,
        from: TEST_SOSPESO_LIST_ITEM.from,
        to: TEST_SOSPESO_LIST_ITEM.to,
        issuerId: TEST_USER_ID,
        paidAmount: 80000,
      },
    });
    const paymentRepo = createFakePaymentRepository({
      [payment.id]: payment,
    });

    const sospesoRepo = createFakeSospesoRepository({});

    const request = new Request("http://localhost:4321/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...EXAMPLE_WEBHOOK_PAYLOAD,
        PCD_LINK_ADD_PARAM: JSON.stringify({ id: TEST_ID }),
      }),
    });

    const route = createHandler({ paymentRepo, sospesoRepo });

    await route({ request });

    expect(await sospesoRepo.retrieveSospesoDetail(payment.id)).toMatchObject({
      consuming: undefined,
      from: "탐정토끼",
      id: "good_first_customer",
      status: "issued",
      to: "퀴어 문화 축제 올 사람",
    });
  });
});
