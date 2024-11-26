import { describe, expect, test } from "vitest";
import { TEST_USER_ID } from "@/auth/fixtures.ts";
import type { Sospeso } from "@/sospeso/domain.ts";
import {
  createFakeSospesoRepository,
  type SospesoRepositoryI,
} from "@/sospeso/repository.ts";

import { generateNanoId } from "@/adapters/generateId.ts";
import { createSospesoServices } from "./services";
import { TEST_NOW } from "@/actions/fixtures";
import { SOSPESO_PRICE } from "@/sospeso/constants";
import { completePayment, createSospesoIssuingPayment, type Payment } from '@/payment/domain';
import { TEST_SOSPESO_LIST_ITEM } from '@/sospeso/fixtures';
import { EXAMPLE_PAYMENT_PAYLOAD } from '@/payment/fixtures';
import { createFakePaymentRepository, type PaymentRepositoryI } from '@/payment/repository';

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
  createPaymentRepository:  (
    initState: Record<string, Payment>,
  ) => Promise<PaymentRepositoryI>,
) {
  describe("sospesoServices: " + name, () => {
    test("소스페소를 발행할 수 있다.", async () => {
      const command = event.command;

      const sospesoRepo = await createSospesoRepository({});
      const paymentRepo = await createPaymentRepository({});

      const sospesoServices = createSospesoServices({ sospesoRepo, paymentRepo });

      await sospesoServices.issueSospeso(command);

      const result = await sospesoRepo.retrieveSospesoDetail(
        command.sospesoId,
      );

      expect(result?.status).toBe("issued");
    });
    
    const testPayment = createSospesoIssuingPayment({
      sospesoId: TEST_SOSPESO_LIST_ITEM.id,
      now: TEST_NOW,
      totalAmount: 80000,
      command: {
        sospesoId: TEST_SOSPESO_LIST_ITEM.id,
        issuedAt: TEST_NOW,
        from: TEST_SOSPESO_LIST_ITEM.from,
        to: TEST_SOSPESO_LIST_ITEM.to,
        issuerId: TEST_USER_ID,
        paidAmount: 80000,
      },
    });
    
    test("결제를 완료할 수 있다", async () => {

      const sospesoRepo = await createSospesoRepository({});
      const paymentRepo = await createPaymentRepository({
        [testPayment.id]: testPayment
      });
      
      const sospesoServices = createSospesoServices({ sospesoRepo, paymentRepo });

      await sospesoServices.completeSospesoPayment(
        {
          paymentId: TEST_SOSPESO_LIST_ITEM.id,
          paymentResult: EXAMPLE_PAYMENT_PAYLOAD,
        }
      );

      const payment = await paymentRepo.retrievePayment(TEST_SOSPESO_LIST_ITEM.id);

      expect(payment?.status).toBe("paid");
    });

    test("결제를 취소할 수 있다", async () => {
      const completedPayment = completePayment(testPayment, EXAMPLE_PAYMENT_PAYLOAD);

      const sospesoRepo = await createSospesoRepository({});
      const paymentRepo = await createPaymentRepository({
        [completedPayment.id]: completedPayment
      });

      const sospesoServices = createSospesoServices({ sospesoRepo, paymentRepo });

      await sospesoServices.cancelSospesoPayment(
        {
          sospesoId: TEST_SOSPESO_LIST_ITEM.id,
        },
      );

      const payment = await paymentRepo.retrievePayment(TEST_SOSPESO_LIST_ITEM.id);

      expect(payment?.status).toBe("cancelled");
    });

  });
}

runSospesoServicesTest("fake", async (initState) =>
  createFakeSospesoRepository(initState),
 async (initState) => createFakePaymentRepository(initState)
);
