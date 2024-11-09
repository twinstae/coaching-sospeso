import { describe, expect, test } from "vitest";
import { createActionServer } from "./index.ts";
import { TEST_SOSPESO_LIST_ITEM, TEST_USER_ID } from "@/sospeso/fixtures.ts";
import type { Sospeso } from "@/sospeso/domain.ts";

import * as schema from "@/adapters/drizzle/schema.ts";
import { drizzle } from "drizzle-orm/libsql";
import { createDrizzleSospesoRepository } from "@/adapters/drizzle/drizzleSospesoRepository.ts";
import { approvedSospeso, issuedSospeso } from "@/sospeso/domain.test.ts";
import {
  createFakeRepository,
  type SospesoRepositoryI,
} from "@/sospeso/repository.ts";

const testDb = drizzle({
  schema,
  logger: false,
  connection: {
    url: "file:test.db",
  },
});

function runSospesoActionsTest(
  name: string,
  createRepository: (
    initState: Record<string, Sospeso>,
  ) => Promise<SospesoRepositoryI>,
) {
  async function createTestActionServer(initState: Record<string, Sospeso>) {
    const repo = await createRepository(initState);
    const actionServer = createActionServer(repo);

    // 실제로는 JSON으로 직렬화된 값이 가기 때문에, Date 등은 문자열로 받는 걸 테스트
    const proxy = new Proxy(actionServer, {
      get(target: any, prop, _receiver) {
        const run = target[prop as any] as (
          input: any,
        ) => Promise<{ data: any; error: any }>;
        if (run instanceof Function) {
          return async function (input: any) {
            return run(JSON.parse(JSON.stringify(input))).then((result) => {
              if (result.error) {
                throw result.error;
              }
              return { data: result.data && result.data, error: result.error };
            });
          };
        }
        return run;
      },
    });

    return proxy as typeof actionServer;
  }

  describe("sospesoActionServer: " + name, () => {
    test("issueSospeso", async () => {
      const actionServer = await createTestActionServer({});
      const { data: before } = await actionServer.retrieveSospesoList({});

      expect(before).toStrictEqual([]);

      await actionServer.issueSospeso({
        sospesoId: TEST_SOSPESO_LIST_ITEM.id,
        issuerId: TEST_USER_ID,
        ...TEST_SOSPESO_LIST_ITEM,
      });

      const { data: after } = await actionServer.retrieveSospesoList({});

      expect(after).toStrictEqual([TEST_SOSPESO_LIST_ITEM]);
    });

    test("applySospeso", async () => {
      const actionServer = await createTestActionServer({
        [issuedSospeso.id]: issuedSospeso,
      });
      const { data: before } =
        await actionServer.retrieveSospesoApplicationList({});

      expect(before).toStrictEqual([]);

      const TEST_APPLICATION_ID = crypto.randomUUID();
      const TEST_NOW = new Date();
      await actionServer.applySospeso({
        sospesoId: issuedSospeso.id,
        applicationId: TEST_APPLICATION_ID,
        content: "저 퀴어 문화 축제 갔다 왔어요",
        appliedAt: TEST_NOW,
      });

      const { data: after } = await actionServer.retrieveSospesoApplicationList(
        {},
      );

      expect(after).toStrictEqual([
        {
          applicant: {
            id: "",
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

      const { data: before } = await actionServer.retrieveSospesoDetail({
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

      const { data: after } = await actionServer.retrieveSospesoDetail({
        sospesoId: approvedSospeso.id,
      });

      expect(after?.status).toBe("consumed");
    });
  });
}

async function createDrizzleTestRepository(initState: Record<string, Sospeso>) {
  const repo = createDrizzleSospesoRepository(testDb);

  await testDb.delete(schema.sospesoConsuming).all();
  await testDb.delete(schema.sospesoApplication).all();
  await testDb.delete(schema.sospesoIssuing).all();
  await testDb.delete(schema.sospeso).all();

  await testDb.insert(schema.user).values({
    id: TEST_USER_ID,
    name: "김토끼",
    email: "test@test.com",
    emailVerified: true,
    image: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }).onConflictDoNothing()

  for (const sospeso of Object.values(initState)) {
    await repo.updateOrSave(sospeso.id, () => sospeso);
  }

  return repo;
}

runSospesoActionsTest("fake", async (initState) =>
  createFakeRepository(initState),
);

runSospesoActionsTest("drizzle sqlite", createDrizzleTestRepository);
