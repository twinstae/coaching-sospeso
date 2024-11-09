import { formatDate } from "@/adapters/dateApi";
import { Link } from "@/routing/Link.tsx";
import type { SospesoStatus } from "@/sospeso/domain";
import { sospesoStatusToLabelDict } from "@/sospeso/label";

export function SospesoList({
  sospesoList,
}: {
  sospesoList: {
    id: string;
    from: string;
    to: string;
    issuedAt: Date;
    status: SospesoStatus;
  }[];
}) {
  return (
    <ul className="flex flex-col items-center">
      {sospesoList.map((sospeso) => (
        <li key={sospeso.id}>
          <Link
            className="link link-primary"
            routeKey="소스페소-상세"
            params={{ sospesoId: sospeso.id }}
          >
            From. {sospeso.from} To. {sospeso.to} 발행일{" "}
            {formatDate(sospeso.issuedAt, "yyyy년 M월 d일")}
            {" " + sospesoStatusToLabelDict[sospeso.status]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
