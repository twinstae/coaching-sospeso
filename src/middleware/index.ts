import { auth } from "@/lib/auth";
import { defineMiddleware } from "astro:middleware";

const staticRoutes = ["/lifelifter/coaches"] satisfies string[];

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.now = new Date();

  if (staticRoutes.includes(context.url.pathname)) {
    return next();
  }

  // dynamic routes
  const result = await auth.api.getSession({
    headers: context.request.headers,
  });

  // console.log("user", result);
  if (result) {
    const { user } = result;
    context.locals.user = {
      id: user.id,
      nickname: user.nickname,
      role: user.role as "admin" | "user",
    };

    return next();
  }

  return next();
});
