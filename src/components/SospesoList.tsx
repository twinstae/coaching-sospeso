import { format년월일 } from "@/adapters/dateApi";
import { Link } from "@/routing/Link.tsx";
import { Bean } from "@/shared/icons/Bean";
import { Coffee } from "@/shared/icons/Coffee";
import type { SospesoStatus } from "@/sospeso/domain";
import { clsx } from "clsx";
import { Mail } from "lucide-react";

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
    <table className="table bg-base-100 rounded-lg">
      <thead>
        <tr>
          <th>From.</th>
          <th>To.</th>
          <th>Date</th>
          <th>Status</th>
          <th>Detail</th>
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
            <td>{format년월일(sospeso.issuedAt)}</td>
            <td>
              {sospeso.status === "issued" ? (
                <div className="flex items-center gap-1">
                  <Bean className="text-yellow-400" />
                  발행
                </div>
              ) : sospeso.status === "pending" ? (
                <div className="flex items-center gap-1">
                  <Coffee className="text-yellow-400" />
                  신청
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Mail className="text-yellow-400" />
                  사용
                </div>
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
