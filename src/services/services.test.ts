import { describe, expect, test } from "vitest";
import { TEST_USER_ID } from "@/auth/fixtures.ts";
import type { Sospeso } from "@/sospeso/domain.ts";
import {
  createFakeSospesoRepository,
  type SospesoRepositoryI,
} from "@/sospeso/repository.ts";

import { generateNanoId } from "@/adapters/generateId.ts";
import { createPaymentServices, createSospesoServices } from "./services";
import { TEST_NOW } from "@/actions/fixtures";
import { SOSPESO_PRICE } from "@/sospeso/constants";
import { EXAMPLE_PAYMENT_PAYLOAD } from "@/payment/fixtures";
import { createFakePaymentRepository, type PaymentRepositoryI } from "@/payment/repository";
import { createSospesoIssuingPayment, type Payment } from "@/payment/domain";

const generateId = generateNanoId;

const sospesoId = generateId();

const event = {
  type: "paymentComplete",
  command: {
    sospesoId: sospesoId,
    from: "퀴어 문화 축제 온 사람",
    to: "퀴어 문화 축제 갔다올 사람",
    issuerId: TEST_USER_ID,
    paidAmount: SOSPESO_PRICE,
    issuedAt: TEST_NOW,
  }
};

function runSospesoServicesTest(
  name: string,
  createSospesoRepository: (
    initState: Record<string, Sospeso>,
  ) => Promise<SospesoRepositoryI>,
) {
  describe("sospesoServices: " + name, () => {
    test("소스페소를 발행할 수 있다.", async () => {
      const command = event.command;

      const sospesoRepo = await createSospesoRepository({});
      const sospesoServices = createSospesoServices(sospesoRepo);

      await sospesoServices.issueSospeso(command);

      const result = await sospesoRepo.retrieveSospesoDetail(
        command.sospesoId,
      );

      expect(result?.status).toBe("issued");
    });
  });
}

function runPaymentServicesTest(
  name: string,
  createPaymentRepository: (
    initState: Record<string, Payment>,
  ) => Promise<PaymentRepositoryI>,
) {
  describe("paymentServices: " + name, () => {
    test("결제를 완료할 수 있다.", async () => {
      const paymentRepo = await createPaymentRepository({});
      const paymentServices = createPaymentServices(paymentRepo);
                  
      await paymentRepo.updateOrSave(sospesoId, () => {
        return createSospesoIssuingPayment({
          sospesoId: sospesoId,
          now: new Date(),
          totalAmount: SOSPESO_PRICE,
          command: event.command,
        });
      });
      
      await paymentServices.completePayment(
        event.command.sospesoId,
        EXAMPLE_PAYMENT_PAYLOAD,
      );

      const result = await paymentRepo.retrievePayment(event.command.sospesoId);
      expect(result?.status).toBe("paid");
    });
  });
}

runSospesoServicesTest("fake", async (initState) =>
  createFakeSospesoRepository(initState),
);

runPaymentServicesTest("fake", async (initState) =>
  createFakePaymentRepository(initState),
);