import { TEST_USER_ID } from "@/auth/fixtures.ts";
import type { ActionContext } from "./actions.ts";

export const TEST_NOW = new Date("2024-11-06T00:00:00Z");

export const NOT_LOGGED_IN_CONTEXT = {
  locals: {
    now: TEST_NOW,
  },
} as ActionContext;

export const LOGGED_IN_CONTEXT = {
  locals: {
    user: {
      id: TEST_USER_ID,
      nickname: "김토끼",
      role: "user",
    },
    now: TEST_NOW,
  },
} as ActionContext;

export const ADMIN_CONTEXT = {
  locals: {
    user: {
      id: TEST_USER_ID,
      nickname: "김코치",
      role: "admin",
    },
    now: TEST_NOW,
  },
} as ActionContext;
