import * as v from "valibot";

export type StaticRoute = { path: string };

export type DynamicRoute = {
  path: string;
  paramsSchema: v.ObjectSchema<
    v.ObjectEntries,
    v.ErrorMessage<v.ObjectIssue> | undefined
  >;
};

type Route = StaticRoute | DynamicRoute;

const pageSchema = v.pipe(v.number(), v.integer(), v.minValue(0));

export const routes = {
  홈: {
    path: "/",
    paramsSchema: v.object({
      page: pageSchema,
    }),
  },
  "소스페소-발행": {
    path: "/sospeso/issuing",
  },
  "소스페소-상세": {
    path: "/sospeso/[sospesoId]",
    paramsSchema: v.object({
      sospesoId: v.pipe(v.string(), v.nanoid()),
    }),
  },
  "소스페소-신청": {
    path: "/sospeso/[sospesoId]/application",
    paramsSchema: v.object({
      sospesoId: v.string(),
    }),
  },
  어드민: {
    path: "/admin",
  },
  "어드민-소스페소-사용": {
    path: "/admin/sospeso/[sospesoId]/consuming",
    paramsSchema: v.object({
      sospesoId: v.string(),
      consumerId: v.string(),
    }),
  },
  "가짜-이메일-인박스": {
    path: "/admin/email/inbox",
    paramsSchema: v.object({
      emailAddress: v.pipe(v.string(), v.email()),
    }),
  },
  로그인: {
    path: "/auth/login",
  },
} satisfies Record<string, Route>;

export function resolveRoute<RouteKey extends RouteKeys>(
  key: RouteKey,
): (typeof routes)[RouteKey] {
  return routes[key];
}

export type RouteKeys = keyof typeof routes;

export type RouteParams<RouteKey extends RouteKeys> =
  (typeof routes)[RouteKey] extends DynamicRoute
    ? v.InferOutput<(typeof routes)[RouteKey]["paramsSchema"]>
    : undefined;
