import { describe, expect, test } from "vitest";
import { createActionServer } from "./index.ts";
import { createFakeRepository } from "@/sospeso/repository.ts";
import { TEST_SOSPESO_LIST_ITEM } from "@/sospeso/fixtures.ts";

describe("sospesoActionServer", () => {
  const actionServer = createActionServer(createFakeRepository({}));
  test("issueSospeso", async () => {
    const { data: before } = await actionServer.retrieveSospesoList({});

    expect(before).toStrictEqual([]);

    await actionServer.issueSospeso({
      sospesoId: TEST_SOSPESO_LIST_ITEM.id,
      ...TEST_SOSPESO_LIST_ITEM,
    });

    const { data: after } = await actionServer.retrieveSospesoList({});

    expect(after).toStrictEqual([TEST_SOSPESO_LIST_ITEM]);
  });
});
