import { sequence } from "astro:middleware";
import { onAuth } from "./auth";
import type { Role } from "@/auth/domain";
import { auth } from "@/lib/auth";
export const onRequest = sequence(async (context, next) => {
  context.locals.now = new Date();

  // 인증이 필요한 pathname 인 경우
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });
  if (session) {
    const user = session.user;

    context.locals.user = {
      id: user.id,
      nickname: user.nickname,
      role: user.role as Role,
    };
  }
  return next();
}, onAuth);
