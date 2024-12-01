import type { Role } from "@/auth/domain";
import * as v from "valibot";

export type StaticRoute = { path: string };

export type DynamicRoute = {
  path: string;
  paramsSchema: v.ObjectSchema<
    v.ObjectEntries,
    v.ErrorMessage<v.ObjectIssue> | undefined
  >;
};

type RouteAuth = {
  auth: {
    required: boolean;
    roles?: Role[];
  };
};

type Route = StaticRoute | DynamicRoute;
type RouteWithAuth = Route & RouteAuth;

const pageSchema = v.pipe(
  v.unknown(),
  v.transform(Number),
  v.number(),
  v.integer(),
);

// {page: "1"}
// /?page=1
// /?page=2&status=
// string => "issued" | "pending" | "consumed"

export const routes = {
  홈: {
    path: "/",
    paramsSchema: v.object({
      page: v.optional(pageSchema),
      status: v.optional(
        v.undefinedable(v.picklist(["issued", "pending", "consumed"])),
      ),
    }),
    auth: {
      required: false,
    },
  },
  "소스페소-발행": {
    path: "/sospeso/issuing",
    auth: {
      required: true,
      roles: ["user"],
    },
  },
  "소스페소-결제": {
    path: "/payment/[paymentId]",
    paramsSchema: v.object({
      paymentId: v.string(),
    }),
    auth: {
      required: true,
      roles: ["user"],
    },
  },
  "소스페소-상세": {
    path: "/sospeso/[sospesoId]",
    paramsSchema: v.object({
      sospesoId: v.pipe(v.string(), v.nanoid()),
    }),
    auth: {
      required: true,
      roles: ["user"],
    },
  },
  "소스페소-신청": {
    path: "/sospeso/[sospesoId]/application",
    paramsSchema: v.object({
      sospesoId: v.string(),
    }),
    auth: {
      required: true,
      roles: ["user"],
    },
  },
  어드민: {
    path: "/admin",
    auth: {
      required: true,
      roles: ["admin"],
    },
  },
  "어드민-소스페소-사용": {
    path: "/admin/sospeso/[sospesoId]/consuming",
    paramsSchema: v.object({
      sospesoId: v.string(),
      consumerId: v.string(),
    }),
    auth: {
      required: true,
      roles: ["admin"],
    },
  },
  "가짜-이메일-인박스": {
    path: "/admin/email/inbox",
    paramsSchema: v.object({
      emailAddress: v.pipe(v.string(), v.email()),
    }),
    auth: {
      required: true,
      roles: ["admin"],
    },
  },
  로그인: {
    path: "/auth/login",
    paramsSchema: v.object({
      error: v.optional(v.picklist(["email_not_found"])),
    }),
    auth: {
      required: false,
    },
  },
  "비밀번호-변경-이메일": {
    path: "/auth/change-password",
    paramsSchema: v.object({}),
    auth: {
      required: false,
    },
  },
  "비밀번호-변경하기": {
    path: "/auth/reset-password",
    paramsSchema: v.object({}),
    auth: {
      required: false,
    },
  },
  회원가입: {
    path: "/auth/signup",
    paramsSchema: v.object({
      email: v.optional(v.pipe(v.string(), v.email())),
    }),
    auth: {
      required: false,
    },
  },
  "회원가입-이메일-전송-완료": {
    path: "/auth/signup/sent",
    paramsSchema: v.object({
      email: v.pipe(v.string(), v.email()),
    }),
    auth: {
      required: false,
    },
  },
  프로필: {
    path: "/auth/me",
    auth: {
      required: true,
      roles: ["user"],
    },
  },
  "개인정보-변경": {
    path: "/auth/me/update",
    auth: {
      required: true,
      roles: ["user"],
    },
  },
  "소스페소-신청완료": {
    path: "/sospeso/applicationSuccess",
    auth: {
      required: false,
    },
  },
  이용약관: {
    path: "/terms/usage",
    auth: {
      required: false,
    },
  },
  개인정보처리방침: {
    path: "/terms/privacy",
    auth: {
      required: false,
    },
  },
  "파라미터-테스트": {
    path: "/test/[testId]",
    paramsSchema: v.object({
      testId: v.string(),
      q: v.string(),
    }),
    auth: {
      required: false,
    },
  },
} satisfies Record<string, RouteWithAuth>;

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
