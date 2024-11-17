import { TEST_USER_ID } from "@/auth/fixtures";
import type { ActionAPIContext } from "astro:actions";

const TEST_NOW = new Date("2024-11-06T00:00:00Z");

export const NOT_LOGGED_IN_CONTEXT = {
  locals: {
    now: TEST_NOW
  },
} as ActionAPIContext;

export const LOGGED_IN_CONTEXT = {
  locals: {
    session: {
      id: TEST_USER_ID,
    },
    now: TEST_NOW
  },
} as ActionAPIContext;
