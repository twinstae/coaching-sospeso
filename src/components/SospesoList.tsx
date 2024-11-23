import { formatDate } from "@/adapters/dateApi";
import { Link } from "@/routing/Link.tsx";
import type { SospesoStatus } from "@/sospeso/domain";
import { clsx } from "clsx";

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
    <table className="table">
      <thead>
        <tr>
          <th>From.</th>
          <th>To.</th>
          <th>발행일</th>
          <th>상태</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sospesoList.map((sospeso) => (
          <tr
            key={sospeso.id}
            className={clsx(sospeso.status === "pending" && "opacity-70")}
          >
            <td>{sospeso.from}</td>
            <td>{sospeso.to}</td>
            <td>{formatDate(sospeso.issuedAt, "yyyy년 M월 d일")}</td>
            <td>
              {sospeso.status === "issued" ? (
                <div className="badge">발행됨</div>
              ) : sospeso.status === "pending" ? (
                <div className="badge"> 대기중</div>
              ) : (
                <div className="stamp">사용함</div>
              )}
            </td>
            <td>
              <Link
                className="btn btn-sm"
                routeKey="소스페소-상세"
                params={{ sospesoId: sospeso.id }}
              >
                보러가기→
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
