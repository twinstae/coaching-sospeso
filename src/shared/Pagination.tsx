import invariant from "@/invariant.ts";
import { Link } from "@/routing/Link";
import type { DynamicRoute, RouteKeys, routes } from "@/routing/routes";
import type * as v from 'valibot';

function range(start: number, end: number) {
  return Array.from({ length: end - 1 }).map((_, index) => index + start);
}

export function Pagination<RouteKey extends RouteKeys>({
  routeKey,
  params,
  current,
  end,
}: {
  current: number;
  end: number;
  routeKey: RouteKey;
  params: (typeof routes)[RouteKey] extends DynamicRoute
  ? Omit<v.InferOutput<(typeof routes)[RouteKey]["paramsSchema"]>, "page">
  : undefined;
}) {
  invariant(current >= 1, "페이지는 양의 정수여야 합니다!");
  invariant(current <= end, "마지막 페이지를 넘어섰습니다!");

  return (
    <div className="join">
      {current !== 1 && (
        <Link
          routeKey={routeKey}
          params={{ ...params, page: current - 1 }}
          className="join-item btn"
        >
          이전
        </Link>
      )}
      {range(1, end + 1).map((page) => (
        <Link
          key={page}
          routeKey={routeKey}
          params={{ ...params, page }}
          className="join-item btn aria-current-page:btn-active"
          aria-current={current === page ? "page" : undefined}
        >
          {page}
        </Link>
      ))}
      {current !== end && (
        <Link
          routeKey={routeKey}
          params={{ ...params, page: current + 1 }}
          className="join-item btn"
        >
          다음
        </Link>
      )}
    </div>
  );
}
