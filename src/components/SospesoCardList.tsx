import { format년월일 } from "@/adapters/dateApi";
import { Link } from "@/routing/Link";
import type { SospesoStatus } from "@/sospeso/domain";
import { clsx } from "clsx";

export function SospesoCardList({
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
    <div className="">
      {sospesoList.map((sospeso) => (
        <Link
          className="btn btn-sm"
          routeKey="소스페소-상세"
          params={{ sospesoId: sospeso.id }}
          key={sospeso.id}
        >
          <div className={clsx(sospeso.status === "pending" && "opacity-70")}>
            <span>{sospeso.from}</span>
            <span>{sospeso.to}</span>
            <span>{format년월일(sospeso.issuedAt)}</span>
            {sospeso.status === "pending" && (
              <div className="flex items-center gap-1">신청자 있음</div>
            )}
            {sospeso.status === "consumed" && (
              <div className="flex items-center gap-1">사용함</div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
