import { TEST_SOSPESO_ID } from "@/sospeso/fixtures.ts";
import { href } from "./href.ts";
import { findRouteByPath } from "./routes.ts";
import { describe, expect, test } from "vitest";

describe("href", () => {
  test("정적인 루트를 찾을 수 있다", () => {
    expect(findRouteByPath(href("소스페소-발행", undefined))).toStrictEqual({
      auth: {
        required: true,
        roles: ["admin", "user"],
      },
      key: "소스페소-발행",
      path: "/sospeso/issuing",
    });
  });

  test("파라미터가 있는 동적인 루트를 생성할 수 있다", () => {
    expect(
      findRouteByPath(href("소스페소-상세", { sospesoId: TEST_SOSPESO_ID })),
    ).toStrictEqual({
      auth: {
        required: true,
        roles: ["admin", "user"],
      },
      key: "소스페소-상세",
      path: "/sospeso/[sospesoId]",
    });
    expect(
      findRouteByPath(href("소스페소-신청", { sospesoId: TEST_SOSPESO_ID })),
    ).toStrictEqual({
      auth: {
        required: true,
        roles: ["admin", "user"],
      },
      key: "소스페소-신청",
      path: "/sospeso/[sospesoId]/application",
    });
  });
});
