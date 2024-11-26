import { afterAll, describe, expect, test } from "vitest";
import { drizzle } from "drizzle-orm/libsql";
import { like } from "drizzle-orm";

import * as schema from "@/adapters/drizzle/schema.ts";
import { createDrizzleSospesoRepository } from "@/adapters/drizzle/drizzleSospesoRepository.ts";
import { generateNanoId } from "@/adapters/generateId.ts";
import { TEST_ADMIN_USER, TEST_USER, TEST_USER_ID } from "@/auth/fixtures.ts";
import { TEST_SOSPESO_LIST_ITEM } from "@/sospeso/fixtures.ts";
import type { Sospeso } from "@/sospeso/domain.ts";
import {
  appliedSospeso,
  approvedSospeso,
  issuedSospeso,
} from "@/sospeso/domain.test.ts";
import {
  createFakeSospesoRepository,
  type SospesoRepositoryI,
} from "@/sospeso/repository.ts";

import { buildTestActionServer } from "./createTestActionServer.ts";
import { ADMIN_CONTEXT, LOGGED_IN_CONTEXT, TEST_NOW } from "./fixtures.ts";
import { paymentApi } from "./actions.ts";
import {
  createFakePaymentRepository,
  type PaymentRepositoryI,
} from "@/payment/repository.ts";
import { type Payment } from "@/payment/domain.ts";
import { createDrizzlePaymentRepository } from "@/adapters/drizzle/drizzlePaymentRepository.ts";

const generateId = generateNanoId;

function runSospesoActionsTest(
  name: string,
  createSospesoRepository: (
    initState: Record<string, Sospeso>,
  ) => Promise<SospesoRepositoryI>,
  createPaymentRepository: (
    initState: Record<string, Payment>,
  ) => Promise<PaymentRepositoryI>,
) {
  function createTestActionServer({
    sospeso,
    payment,
  }: {
    sospeso: Record<string, Sospeso>;
    payment?: Record<string, Payment>;
  }) {
    return buildTestActionServer({
      sospeso: {
        createSospesoRepository,
        initState: sospeso,
      },
      payment: {
        createPaymentRepository,
        initState: payment ?? {},
      },
    });
  }

  describe("sospesoActionServer: " + name, () => {
    test("소스페소 결제 링크를 생성할 수 있다", async () => {
      const { actionServer, paymentRepo } = await createTestActionServer({
        sospeso: {},
      });

      await actionServer.createIssuingSospesoPayment(
        {
          sospesoId: TEST_SOSPESO_LIST_ITEM.id,
          ...TEST_SOSPESO_LIST_ITEM,
        },
        LOGGED_IN_CONTEXT,
      );

      const payment = await paymentRepo.retrievePayment(
        TEST_SOSPESO_LIST_ITEM.id,
      );

      const { paymentLink } = await paymentApi.generatePaymentLink(payment);

      expect(paymentLink).toBe(
        "https://democpay.payple.kr/php/link/?SID=MTI6MTU4NDYwNzI4Mg?id=7pD2z_SkcIWR75",
      );
    });

    test("소스페소에 신청할 수 있다", async () => {
      const id = generateId();
      const { actionServer, sospesoRepo } = await createTestActionServer({
        sospeso: {
          [id]: { ...issuedSospeso, id },
        },
      });
      const before = await sospesoRepo.retrieveApplicationList();

      expect(before).toMatchObject([]);

      const TEST_APPLICATION_ID = generateId();
      await actionServer.applySospeso(
        {
          sospesoId: id,
          applicationId: TEST_APPLICATION_ID,
          content: "저 퀴어 문화 축제 갔다 왔어요"
        },
        LOGGED_IN_CONTEXT,
      );

      const after = await sospesoRepo.retrieveApplicationList();

      expect(after).toMatchObject([
        {
          applicant: {
            id: TEST_USER_ID,
            nickname: "김토끼",
          },
          appliedAt: TEST_NOW,
          content: "저 퀴어 문화 축제 갔다 왔어요",
          id: TEST_APPLICATION_ID,
          sospesoId: id,
          status: "applied",
          to: "퀴어 문화 축제 올 사람",
        },
      ]);
    });

    test("approveSospesoApplication", async () => {
      const { actionServer, sospesoRepo } = await createTestActionServer({
        sospeso: {
          [appliedSospeso.id]: appliedSospeso,
        },
      });
      const applicationId = appliedSospeso.applicationList[0]!.id;

      const before = await sospesoRepo.retrieveApplicationList();

      expect(before.find((item) => item.id === applicationId)?.status).toBe(
        "applied",
      );

      await actionServer.approveSospesoApplication(
        {
          sospesoId: appliedSospeso.id,
          applicationId: applicationId,
        },
        ADMIN_CONTEXT,
      );

      const after = await sospesoRepo.retrieveApplicationList();

      expect(after.find((item) => item.id === applicationId)?.status).toBe(
        "approved",
      );
    });

    test("rejectSospesoApplication", async () => {
      const { actionServer, sospesoRepo } = await createTestActionServer({
        sospeso: {
          [appliedSospeso.id]: appliedSospeso,
        },
      });
      const applicationId = appliedSospeso.applicationList[0]!.id;

      const before = await sospesoRepo.retrieveApplicationList();

      expect(before.find((item) => item.id === applicationId)?.status).toBe(
        "applied",
      );

      await actionServer.rejectSospesoApplication(
        {
          sospesoId: appliedSospeso.id,
          applicationId: applicationId,
        },
        ADMIN_CONTEXT,
      );

      const after = await sospesoRepo.retrieveApplicationList();

      expect(after.find((item) => item.id === applicationId)?.status).toBe(
        "rejected",
      );
    });

    test("관리자가 아니면 승인도 거절도 할 수 없다", async () => {
      const { actionServer, sospesoRepo } = await createTestActionServer({
        sospeso: {
          [appliedSospeso.id]: appliedSospeso,
        },
      });
      const applicationId = appliedSospeso.applicationList[0]!.id;

      await expect(
        actionServer.approveSospesoApplication(
          {
            sospesoId: appliedSospeso.id,
            applicationId: applicationId,
          },
          LOGGED_IN_CONTEXT,
        ),
      ).rejects.toThrowError("관리자가 아닙니다!");

      await expect(
        actionServer.rejectSospesoApplication(
          {
            sospesoId: appliedSospeso.id,
            applicationId: applicationId,
          },
          LOGGED_IN_CONTEXT,
        ),
      ).rejects.toThrowError("관리자가 아닙니다!");

      const after = await sospesoRepo.retrieveApplicationList();

      expect(after.find((item) => item.id === applicationId)?.status).toBe(
        "applied",
      );
    });

    test("consumeSospeso", async () => {
      // 기존에 이미 승인된 소스페소가 있었음
      const { actionServer, sospesoRepo } = await createTestActionServer({
        sospeso: {
          [approvedSospeso.id]: approvedSospeso,
        },
      });

      const before = await sospesoRepo.retrieveSospesoDetail(
        approvedSospeso.id,
      );

      expect(before?.status).toBe("pending");

      await actionServer.consumeSospeso(
        {
          sospesoId: approvedSospeso.id,
          consumerId: TEST_USER_ID, // TODO user.id
          coachId: TEST_USER_ID, // user.id
          consumingId: generateId(),
          content: "너무 도움이 되었어요!",
          memo: "장소 시간 어쩌구 코칭 일지 링크 등등",
        },
        ADMIN_CONTEXT,
      );

      const after = await sospesoRepo.retrieveSospesoDetail(approvedSospeso.id);

      expect(after?.status).toBe("consumed");
    });
  });
}

const testDbReallySeriously = drizzle({
  schema,
  logger: false,
  connection: {
    url: "file:test.db",
  },
});

async function createDrizzleTestSospesoRepository(
  initState: Record<string, Sospeso>,
) {
  await testDbReallySeriously
    .insert(schema.user)
    .values(TEST_USER)
    .onConflictDoNothing();
  await testDbReallySeriously
    .insert(schema.user)
    .values(TEST_ADMIN_USER)
    .onConflictDoNothing();

  const repo = createDrizzleSospesoRepository(testDbReallySeriously);

  // prod db에 실행하면 절대 안 됨
  await testDbReallySeriously.delete(schema.sospesoConsuming).all();
  await testDbReallySeriously.delete(schema.sospesoApplication).all();
  await testDbReallySeriously.delete(schema.sospesoIssuing).all();
  await testDbReallySeriously.delete(schema.sospeso).all();

  for (const sospeso of Object.values(initState)) {
    await repo.updateOrSave(sospeso.id, () => sospeso);
  }

  return repo;
}

async function createDrizzleTestPaymentRepository(
  initState: Record<string, Payment>,
) {
  const repo = createDrizzlePaymentRepository(testDbReallySeriously);

  // prod db에 실행하면 절대 안 됨
  await testDbReallySeriously.delete(schema.payment).all();

  for (const payment of Object.values(initState)) {
    await repo.updateOrSave(payment.id, () => payment);
  }

  return repo;
}

afterAll(async () => {
  const testDbReallySeriously = drizzle({
    schema,
    logger: false,
    connection: {
      url: "file:test.db",
    },
  });

  // // prod db에 실행하면 절대 안 됨
  // // sospeso
  await testDbReallySeriously.delete(schema.sospesoConsuming).all();
  await testDbReallySeriously.delete(schema.sospesoApplication).all();
  await testDbReallySeriously.delete(schema.sospesoIssuing).all();
  await testDbReallySeriously.delete(schema.sospeso).all();
  // payment
  await testDbReallySeriously.delete(schema.payment).all();

  await testDbReallySeriously
    .delete(schema.user)
    .where(like(schema.user.email, "%@test.kr"))
    .run();

  // await createDrizzleTestSospesoRepository(
  //   Object.fromEntries(
  //     Array.from({ length: 100 }).map((_, i) => {
  //       const sospeso = randomSospeso(
  //         pick(["issued", "issued", "consumed", "consumed", "pending"]),
  //       );
  //       return [sospeso.id, sospeso];
  //     }),
  //   ),
  // );
});

runSospesoActionsTest(
  "fake",
  async (initState) => createFakeSospesoRepository(initState),
  async (initState) => createFakePaymentRepository(initState),
);

runSospesoActionsTest(
  "drizzle sqlite",
  createDrizzleTestSospesoRepository,
  createDrizzleTestPaymentRepository,
);
