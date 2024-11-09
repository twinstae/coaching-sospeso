import { Link } from "@/routing/Link";

export function Pagination({ current }: { current: number }) {
  return (
    <div className="join">
      <Link
        routeKey="홈"
        params={{ page: 1 }}
        className="join-item btn"
        aria-current={current === 1 ? "page" : undefined}
      >
        1
      </Link>
      <Link
        routeKey="홈"
        params={{ page: 2 }}
        className="join-item btn aria-current-page:btn-active"
        aria-current={current === 2 ? "page" : undefined}
      >
        2
      </Link>
      <Link
        routeKey="홈"
        params={{ page: 3 }}
        className="join-item btn"
        aria-current={current === 3 ? "page" : undefined}
      >
        3
      </Link>
      <Link
        routeKey="홈"
        params={{ page: 4 }}
        className="join-item btn"
        aria-current={current === 4 ? "page" : undefined}
      >
        4
      </Link>
    </div>
  );
}
