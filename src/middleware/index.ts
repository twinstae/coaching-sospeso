import type { Role } from "@/auth/domain";
import { auth } from "@/lib/auth";
import { href } from "@/routing/href";
import { routes } from "@/routing/routes";
import { defineMiddleware } from "astro:middleware";

const staticRoutes = ["/lifelifter/coaches"] satisfies string[];

function findRouteByPath(pathname: string) {
  return Object.values(routes).find((route) => {
    if (route.path.includes("[")) {
      // 동적 라우트인 경우 정규식으로 매칭
      const pattern = route.path.replace(/\[.*?\]/g, "[^/]+");
      return new RegExp(`^${pattern}$`).test(pathname);
    }
    return route.path === pathname;
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.now = new Date();

  if (staticRoutes.includes(context.url.pathname)) {
    return next();
  }

  // pathname 에 매칭되는 route 찾기
  const route = findRouteByPath(context.url.pathname);

  // 인증이 필요하지 않은 pathname 인 경우
  if (!route || !route.auth?.required) {
    return next();
  }

  // 인증이 필요한 pathname 인 경우
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  // 세션이 없는 경우
  if (!session) {
    return context.redirect(href("로그인", {}));
  }

  const { user } = session;
  const userRole = user.role as Role;

  // 권한이 없는 경우
  if (route.auth.roles && !(route.auth.roles as Role[]).includes(userRole)) {
    console.log("Middleware 권한 없음", { route, user });
    return context.redirect(href("로그인", {}));
  }

  console.log("Middleware 권한 있음", { route, user });

  // 권한이 있는 경우 최소한의 user 정보를 저장ㄴ
  context.locals.user = {
    id: user.id,
    nickname: user.nickname,
    role: user.role as Role,
  };

  return next();
});
