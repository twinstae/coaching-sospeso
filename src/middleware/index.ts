import { auth } from "@/lib/auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const result = await auth.api.getSession({
    headers: context.request.headers,
  });

  console.log("session", result);
  if (result) {
    const { user } = result;
    context.locals.session = {
      name: user.name,
    };

    return context.rewrite("/");
  }

  return next();
});
