import { ListFilter } from 'lucide-react';
import { Link } from "@/routing/Link";
import { sospesoStatusToLabelDict } from "@/sospeso/label";

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

function entriesFromObject<T extends object>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>;
}

export function SospesoFilter() {
  return (
    <nav className="w-full flex justify-start gap-2">
      <details className="dropdown">
        <summary className="btn btn-sm m-1">
          <ListFilter size="16" />필터
        </summary>
        <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-24 p-2 shadow">
          {entriesFromObject(sospesoStatusToLabelDict).map(
            ([status, label]) => (
              <li key={status}>
                <Link routeKey="홈" params={{ status }} className="">
                  {label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </details>
    </nav>
  );
}

// webhook
// 페이플 -> 결제 완료 -> payment 모델을 paid로 처리
// -> sospeso model issuing 발행
