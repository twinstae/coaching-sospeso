import { afterAll, describe, expect, test } from "vitest";
import { drizzle } from "drizzle-orm/libsql";
import { like } from "drizzle-orm";

import * as schema from "@/adapters/drizzle/schema.ts";
import { createDrizzleSospesoRepository } from "@/adapters/drizzle/drizzleSospesoRepository.ts";
import { generateNanoId } from "@/adapters/generateId.ts";
import { TEST_USER, TEST_USER_ID } from "@/auth/fixtures.ts";
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
import { LOGGED_IN_CONTEXT } from "./fixtures.ts";

const generateId = generateNanoId;

function runSospesoActionsTest(
  name: string,
  createRepository: (
    initState: Record<string, Sospeso>,
  ) => Promise<SospesoRepositoryI>,
) {
  function createTestActionServer(initState: Record<string, Sospeso>) {
    return buildTestActionServer(createRepository, initState);
  }

  describe("sospesoActionServer: " + name, () => {
    test("createIssuingSospesoPayment", async () => {
      const actionServer = await createTestActionServer({});

      await expect(() =>
        actionServer.generatePaymentLink({
          paymentId: TEST_SOSPESO_LIST_ITEM.id,
        }),
      ).rejects.toThrowError("결제가 존재하지 않습니다! : 7pD2z_SkcIWR75");

      await actionServer.createIssuingSospesoPayment(
        {
          sospesoId: TEST_SOSPESO_LIST_ITEM.id,
          ...TEST_SOSPESO_LIST_ITEM,
        },
        LOGGED_IN_CONTEXT,
      );

      const { paymentLink } = await actionServer.generatePaymentLink({
        paymentId: TEST_SOSPESO_LIST_ITEM.id,
      });

      expect(paymentLink).toBe(
        "https://democpay.payple.kr/php/link/?SID=MTI6MTU4NDYwNzI4Mg?id=7pD2z_SkcIWR75",
      );
    });

    test("applySospeso", async () => {
      const id = generateId();
      const actionServer = await createTestActionServer({
        [id]: { ...issuedSospeso, id },
      });
      const before = await actionServer.retrieveSospesoApplicationList({});

      expect(before).toMatchObject([]);

      const TEST_APPLICATION_ID = generateId();
      const TEST_NOW = new Date();
      await actionServer.applySospeso(
        {
          sospesoId: id,
          applicationId: TEST_APPLICATION_ID,
          content: "저 퀴어 문화 축제 갔다 왔어요",
          appliedAt: TEST_NOW,
        },
        LOGGED_IN_CONTEXT,
      );

      const after = await actionServer.retrieveSospesoApplicationList({});

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
      const actionServer = await createTestActionServer({
        [appliedSospeso.id]: appliedSospeso,
      });
      const applicationId = appliedSospeso.applicationList[0]!.id;

      const before = await actionServer.retrieveSospesoApplicationList({});

      expect(before.find((item) => item.id === applicationId)?.status).toBe(
        "applied",
      );

      await actionServer.approveSospesoApplication({
        sospesoId: appliedSospeso.id,
        applicationId: applicationId,
      });

      const after = await actionServer.retrieveSospesoApplicationList({});

      expect(after.find((item) => item.id === applicationId)?.status).toBe(
        "approved",
      );
    });

    test("rejectSospesoApplication", async () => {
      const actionServer = await createTestActionServer({
        [appliedSospeso.id]: appliedSospeso,
      });
      const applicationId = appliedSospeso.applicationList[0]!.id;

      const before = await actionServer.retrieveSospesoApplicationList({});

      expect(before.find((item) => item.id === applicationId)?.status).toBe(
        "applied",
      );

      await actionServer.rejectSospesoApplication({
        sospesoId: appliedSospeso.id,
        applicationId: applicationId,
      });

      const after = await actionServer.retrieveSospesoApplicationList({});

      expect(after.find((item) => item.id === applicationId)?.status).toBe(
        "rejected",
      );
    });

    test("consumeSospeso", async () => {
      // 기존에 이미 승인된 소스페소가 있었음
      const actionServer = await createTestActionServer({
        [approvedSospeso.id]: approvedSospeso,
      });

      const before = await actionServer.retrieveSospesoDetail({
        sospesoId: approvedSospeso.id,
      });

      expect(before?.status).toBe("pending");

      await actionServer.consumeSospeso({
        sospesoId: approvedSospeso.id,
        consumerId: TEST_USER_ID, // TODO user.id
        coachId: TEST_USER_ID, // user.id
        consumingId: generateId(),
        consumedAt: new Date(),
        content: "너무 도움이 되었어요!",
        memo: "장소 시간 어쩌구 코칭 일지 링크 등등",
      });

      const after = await actionServer.retrieveSospesoDetail({
        sospesoId: approvedSospeso.id,
      });

      expect(after?.status).toBe("consumed");
    });
  });
}

async function createDrizzleTestRepository(initState: Record<string, Sospeso>) {
  const testDbReallySeriously = drizzle({
    schema,
    logger: false,
    connection: {
      url: "file:test.db",
    },
  });

  await testDbReallySeriously
    .insert(schema.user)
    .values(TEST_USER)
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

afterAll(async () => {
  const testDbReallySeriously = drizzle({
    schema,
    logger: false,
    connection: {
      url: "file:test.db",
    },
  });

  // prod db에 실행하면 절대 안 됨
  await testDbReallySeriously.delete(schema.sospesoConsuming).all();
  await testDbReallySeriously.delete(schema.sospesoApplication).all();
  await testDbReallySeriously.delete(schema.sospesoIssuing).all();
  await testDbReallySeriously.delete(schema.sospeso).all();

  await testDbReallySeriously
    .delete(schema.user)
    .where(like(schema.user.email, "%@test.kr"))
    .run();
});

runSospesoActionsTest("fake", async (initState) =>
  createFakeSospesoRepository(initState),
);

runSospesoActionsTest("drizzle sqlite", createDrizzleTestRepository);
