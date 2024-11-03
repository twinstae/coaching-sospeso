import { beforeEach, describe, expect, test } from "vitest";
import { createActionServer } from "./index.ts";
import { TEST_SOSPESO_LIST_ITEM } from "@/sospeso/fixtures.ts";
import { createDrizzleSospesoRepository } from '@/db/drizzleSospesoRepository.ts';
import * as schema from "../db/schema.ts";
import { drizzle } from 'drizzle-orm/libsql';
// import migration from "../../migrations/0000_handy_satana.sql?raw";
import { createFakeRepository, type SospesoRepositoryI } from '@/sospeso/repository.ts';

const testDb = drizzle({
  schema,
  connection: {
    url: "file:test.db",
  },
});

beforeEach(async () => {
  // for (const statement of migration.split("\n--> statement-breakpoint\n")) {
  //   await testDb.run(statement).execute();
  // }

  await testDb.delete(schema.sospeso).all();
  await testDb.delete(schema.sospesoIssuing).all();
  await testDb.delete(schema.sospesoApplication).all();
  await testDb.delete(schema.sospesoConsuming).all();
})

function runActionTest(implName: string, repository: SospesoRepositoryI) {
  describe("sospesoActionServer: " + implName, () => {
    const actionServer = createActionServer(repository);
    test("issueSospeso", async () => {
      const before = await actionServer.retrieveSospesoList({});

      expect(before.data).toStrictEqual([]);

      const { error } = await actionServer.issueSospeso({
        sospesoId: TEST_SOSPESO_LIST_ITEM.id,
        ...TEST_SOSPESO_LIST_ITEM,
      });

      expect(error).toBe(undefined);

      const after = await actionServer.retrieveSospesoList({});

      expect(after.error).toStrictEqual(undefined)
      expect(after.data).toStrictEqual([TEST_SOSPESO_LIST_ITEM]);
    });
  });

}

runActionTest("fakeRepository", createFakeRepository());
runActionTest("drizzleRepository", createDrizzleSospesoRepository(testDb));