import { renderTL } from "@/siheom/renderTL.tsx";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { SospesoList } from "./SospesoList";
import { TEST_SOSPESO_LIST_ITEM } from "@/sospeso/fixtures";
import { tableToMarkdown } from "@/siheom/tableToMarkdown";

describe("SospesoList", () => {
  test("목록에서 to, from, issuedAt, status를 볼 수 있다", async () => {
    renderTL(<SospesoList sospesoList={[TEST_SOSPESO_LIST_ITEM]} />);

    await expectTL(queryTL.link("보러가기→")).toBeVisible();
    expect(tableToMarkdown(queryTL.table("").get())).toMatchInlineSnapshot(`
      "|    From. |                    To. |          발행일 |   상태 |           |
      | -------- | ---------------------- | --------------- | ------ | --------- |
      | 탐정토끼 | 퀴어 문화 축제 올 사람 | 2024년 11월 9일 | 발행됨 | 보러가기→ |
      "
    `);
  });
});
