import { afterAll, describe, expect, test } from "vitest";
import { drizzle } from "drizzle-orm/libsql";
import { like } from "drizzle-orm";

import * as schema from "@/adapters/drizzle/schema.ts";
import { createDrizzleSospesoRepository } from "@/adapters/drizzle/drizzleSospesoRepository.ts";
import { TEST_ADMIN_USER, TEST_USER, TEST_USER_ID } from "@/auth/fixtures.ts";
import type { Sospeso } from "@/sospeso/domain.ts";
import {
  createFakeSospesoRepository,
  type SospesoRepositoryI,
} from "@/sospeso/repository.ts";

import { generateNanoId } from "@/adapters/generateId.ts";
import { createSospesoServices } from "./services";
import { TEST_NOW } from "@/actions/fixtures";
import { SOSPESO_PRICE } from "@/sospeso/constants";

const generateId = generateNanoId;

const sospesoId = generateId();

const issuingSospeso = {
  sospesoId: sospesoId,
  from: "퀴어 문화 축제 온 사람",
  to: "퀴어 문화 축제 갔다올 사람",
  issuerId: TEST_USER_ID,
  paidAmount: SOSPESO_PRICE,
  issuedAt: TEST_NOW,
};

const createSospesoTestRepository = async ({
  createSospesoRepository,
  sospeso,
}: {
  createSospesoRepository: (
    initState: Record<string, Sospeso>,
  ) => Promise<SospesoRepositoryI>;
  sospeso: Record<string, Sospeso>;
}) => {
  return await createSospesoRepository(sospeso);
};

function runSospesoServicesTest(
  name: string,
  createSospesoRepository: (
    initState: Record<string, Sospeso>,
  ) => Promise<SospesoRepositoryI>,
) {
  describe("sospesoServices: " + name, () => {
    test("소스페소를 발행할 수 있다.", async () => {
      const sospesoRepo = await createSospesoTestRepository({
        createSospesoRepository,
        sospeso: {},
      });

      const sospesoServices = createSospesoServices(sospesoRepo);

      await sospesoServices.issueSospeso({
        command: issuingSospeso,
        context: {
          user: {
            id: TEST_USER_ID,
            nickname: "김코치",
            role: "admin",
          },
        },
      });

      const result = await sospesoRepo.retrieveSospesoDetail(
        issuingSospeso.sospesoId,
      );

      expect(result?.status).toBe("issued");
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

runSospesoServicesTest("drizzle sqlite", createDrizzleTestSospesoRepository);

runSospesoServicesTest("fake", async (initState) =>
  createFakeSospesoRepository(initState),
);
