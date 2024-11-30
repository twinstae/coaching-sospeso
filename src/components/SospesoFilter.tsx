import { ListFilter } from "lucide-react";
import { Link } from "@/routing/Link.tsx";
import { sospesoStatusToLabelDict } from "@/sospeso/label.ts";
import type { SospesoStatus } from "@/sospeso/domain.ts";

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

function entriesFromObject<T extends object>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>;
}

export function SospesoFilter({
  currentStatus,
}: {
  currentStatus: SospesoStatus | undefined;
}) {
  return (
    <nav className="w-full flex justify-start gap-2">
      <details className="dropdown">
        <summary className="btn btn-sm m-1 bg-base-100">
          <ListFilter size="16" />
          필터
        </summary>
        <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-32 p-2 shadow">
          <li>
            <Link
              routeKey="홈"
              params={{ page: 1 }}
              className="flex space-between"
            >
              전체 {currentStatus === undefined && "✓"}
            </Link>
          </li>
          {entriesFromObject(sospesoStatusToLabelDict).map(
            ([status, label]) => (
              <li key={status}>
                <Link
                  routeKey="홈"
                  params={{ status, page: 1 }}
                  className="flex space-between"
                >
                  {label} {currentStatus === status && "✓"}
                </Link>
              </li>
            ),
          )}
        </ul>
      </details>
    </nav>
  );
}
