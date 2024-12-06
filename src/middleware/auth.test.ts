import { describe, expect, test } from "vitest";
import { onAuth } from "./auth.ts";
import { href } from "@/routing/href";
import { TEST_ADMIN_USER, TEST_USER } from "@/auth/fixtures.ts";
import {
  createContext,
  LOCALHOST,
  next,
  responseToHTTP,
  redirect,
} from "./utils.ts";

describe("onAuth middleware", () => {
  test("정적인 루트", async () => {
    const res = await onAuth(
      createContext(new URL(href("코치-소개", undefined), LOCALHOST), {}),
      next,
    );
    expect(await responseToHTTP(res)).toBe(await responseToHTTP(await next()));
  });

  test("로그인해야 하는 루트에 로그인하지 않은 경우", async () => {
    const res = await onAuth(
      createContext(new URL(href("어드민", undefined), LOCALHOST), {}),
      next,
    );
    expect(await responseToHTTP(res)).toBe(
      await responseToHTTP(redirect(href("로그인", {}))),
    );
  });

  test("로그인했어도 권한이 없는 경우", async () => {
    const res = await onAuth(
      createContext(
        new URL(href("어드민", undefined), LOCALHOST),
        {},
        {
          user: TEST_USER,
        },
      ),
      next,
    );
    expect(await responseToHTTP(res)).toBe(
      await responseToHTTP(redirect("/403")),
    );
  });

  test("권한이 있는 경우", async () => {
    const res = await onAuth(
      createContext(
        new URL(href("어드민", undefined), LOCALHOST),
        {},
        {
          user: TEST_ADMIN_USER,
        },
      ),
      next,
    );
    expect(await responseToHTTP(res)).toBe(await responseToHTTP(await next()));
  });
});
