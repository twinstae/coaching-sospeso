import { TEST_SOSPESO_ID } from "@/sospeso/fixtures.ts";
import { checkAccess } from "./access.ts";
import { href } from "./href.ts";
import { describe, expect, test } from "vitest";

describe("checkAccess", () => {
  test("로그인하지 않아도 접근 가능한 루트", () => {
    expect(
      checkAccess({
        path: href("로그인", {}),
        isLoggedIn: false,
        role: "user",
      }),
    ).toBe("can-access");
  });

  test("로그인해야 접근 가능한 루트", () => {
    const path = href("소스페소-신청", { sospesoId: TEST_SOSPESO_ID });
    expect(
      checkAccess({
        path,
        isLoggedIn: false,
        role: "user",
      }),
    ).toBe("need-login");

    expect(
      checkAccess({
        path,
        isLoggedIn: true,
        role: "user",
      }),
    ).toBe("can-access");
  });

  test("관리자만 접근 가능한 루트", () => {
    const path = href("어드민", undefined);
    expect(
      checkAccess({
        path,
        isLoggedIn: false,
        role: "user",
      }),
    ).toBe("need-login");

    expect(
      checkAccess({
        path,
        isLoggedIn: true,
        role: "user",
      }),
    ).toBe("not-authorized");

    expect(
      checkAccess({
        path,
        isLoggedIn: true,
        role: "admin",
      }),
    ).toBe("can-access");
  });
});
