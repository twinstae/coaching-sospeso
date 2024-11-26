import { describe, expect, test } from "vitest";
import { createSospesoIssuingPayment } from "../../../payment/domain";
import { TEST_SOSPESO_LIST_ITEM } from "../../../sospeso/fixtures";
import { EXAMPLE_WEBHOOK_PAYLOAD } from "../../../payment/fixtures";
import { paymentRepo } from "../../../actions/actions";
import { SOSPESO_PRICE } from "../../../sospeso/constants";

describe("PaymentHandler", () => {
  test("결제완료 웹훅을 받으면 소스페소를 발행한다", async () => {
    const TEST_ID = "good_first_customer";
    await paymentRepo.updateOrSave(TEST_SOSPESO_LIST_ITEM.id, () => {
      return createSospesoIssuingPayment({
        sospesoId: TEST_ID,
        now: new Date(),
        totalAmount: SOSPESO_PRICE,
        command: {
          ...TEST_SOSPESO_LIST_ITEM,
          sospesoId: TEST_ID,
          paidAmount: SOSPESO_PRICE,
          issuerId: "test",
        },
      });
    });

    await fetch('http://localhost:4321/api/payment/handler', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...EXAMPLE_WEBHOOK_PAYLOAD, PCD_LINK_ADD_PARAM: JSON.stringify({ id: TEST_ID }) })
    });

    const payment = await paymentRepo.retrievePayment(TEST_ID);
    expect(payment.status).toBe("paid");
  });
});
