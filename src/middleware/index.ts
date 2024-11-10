import { auth } from "@/lib/auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const result = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (result) {
    const { user } = result;
    context.locals.session = {
      id: user.id,
      nickname: user.nickname,
    };

    return next();
  }

  return next();
});
