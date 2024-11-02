import { beforeEach, describe, expect, test } from "vitest";
import { createActionServer } from "./index.ts";
import { TEST_SOSPESO_LIST_ITEM } from "@/sospeso/fixtures.ts";
import { createDrizzleSospesoRepository } from '@/db/drizzleSospesoRepository.ts';
import * as schema from "../db/schema.ts";
import { drizzle } from 'drizzle-orm/libsql';

const testDb = drizzle({
    schema,
    connection: {
      url: "file:test.db",
    },
  });

beforeEach(async () => {
    await testDb.delete(schema.sospeso).all();
    await testDb.delete(schema.sospesoIssuing).all();
    await testDb.delete(schema.sospesoApplication).all();
    await testDb.delete(schema.sospesoConsuming).all();
})

describe("sospesoActionServer", () => {
  const actionServer = createActionServer(createDrizzleSospesoRepository(testDb));
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
