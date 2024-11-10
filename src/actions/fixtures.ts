import { TEST_USER_ID } from "@/auth/fixtures";
import type { ActionAPIContext } from "astro:actions";

export const LOGGED_IN_CONTEXT = {
  locals: {
    session: {
      id: TEST_USER_ID,
    },
  },
} as ActionAPIContext;
