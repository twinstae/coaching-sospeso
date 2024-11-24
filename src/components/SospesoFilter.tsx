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
    <nav>
      {entriesFromObject(sospesoStatusToLabelDict).map(([status, label]) => (
        <Link routeKey="홈" params={{ status }}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
