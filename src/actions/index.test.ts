import { describe, expect, test } from "vitest";
import { TEST_SOSPESO_LIST_ITEM } from "@/sospeso/fixtures.ts";
import type { Sospeso } from "@/sospeso/domain.ts";

import * as schema from "@/adapters/drizzle/schema.ts";
import { drizzle } from "drizzle-orm/libsql";
import { createDrizzleSospesoRepository } from "@/adapters/drizzle/drizzleSospesoRepository.ts";
import { approvedSospeso, issuedSospeso } from "@/sospeso/domain.test.ts";
import {
  createFakeRepository,
  type SospesoRepositoryI,
} from "@/sospeso/repository.ts";
import { TEST_USER, TEST_USER_ID } from "@/auth/fixtures.ts";
import { buildTestActionServer } from "./createTestActionServer.ts";
import { LOGGED_IN_CONTEXT } from "./fixtures.ts";

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
    test("issueSospeso", async () => {
      const actionServer = await createTestActionServer({});
      const before = await actionServer.retrieveSospesoList({});

      expect(before).toStrictEqual([]);

      await actionServer.issueSospeso(
        {
          sospesoId: TEST_SOSPESO_LIST_ITEM.id,
          ...TEST_SOSPESO_LIST_ITEM,
        },
        LOGGED_IN_CONTEXT,
      );

      const after = await actionServer.retrieveSospesoList({});

      expect(after).toStrictEqual([TEST_SOSPESO_LIST_ITEM]);
    });

    test("applySospeso", async () => {
      const actionServer = await createTestActionServer({
        [issuedSospeso.id]: issuedSospeso,
      });
      const before = await actionServer.retrieveSospesoApplicationList({});

      expect(before).toStrictEqual([]);

      const TEST_APPLICATION_ID = crypto.randomUUID();
      const TEST_NOW = new Date();
      await actionServer.applySospeso({
        sospesoId: issuedSospeso.id,
        applicationId: TEST_APPLICATION_ID,
        content: "저 퀴어 문화 축제 갔다 왔어요",
        applicantId: TEST_USER_ID,
        appliedAt: TEST_NOW,
      });

      const after = await actionServer.retrieveSospesoApplicationList({});

      expect(after).toStrictEqual([
        {
          applicant: {
            id: TEST_USER_ID,
            nickname: "김토끼",
          },
          appliedAt: TEST_NOW,
          content: "저 퀴어 문화 축제 갔다 왔어요",
          id: TEST_APPLICATION_ID,
          sospesoId: issuedSospeso.id,
          status: "applied",
          to: "퀴어 문화 축제 올 사람",
        },
      ]);
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
        consumingId: crypto.randomUUID(),
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

  const repo = createDrizzleSospesoRepository(testDbReallySeriously);

  // prod db에 실행하면 절대 안 됨
  await testDbReallySeriously.delete(schema.sospesoConsuming).all();
  await testDbReallySeriously.delete(schema.sospesoApplication).all();
  await testDbReallySeriously.delete(schema.sospesoIssuing).all();
  await testDbReallySeriously.delete(schema.sospeso).all();

  await testDbReallySeriously
    .insert(schema.user)
    .values(TEST_USER)
    .onConflictDoNothing();

  for (const sospeso of Object.values(initState)) {
    await repo.updateOrSave(sospeso.id, () => sospeso);
  }

  return repo;
}

runSospesoActionsTest("fake", async (initState) =>
  createFakeRepository(initState),
);

runSospesoActionsTest("drizzle sqlite", createDrizzleTestRepository);
