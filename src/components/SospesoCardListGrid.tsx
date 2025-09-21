import { format년월일 } from "@/adapters/dateApi";
import { Link } from "@/routing/Link";
import type { SospesoStatus } from "@/sospeso/domain";

export function SospesoCardGrid({
  isLoggedIn,
  sospesoList,
}: {
  isLoggedIn: boolean,
  sospesoList: {
    id: string;
    from: string;
    to: string;
    issuedAt: Date;
    status: SospesoStatus;
  }[];
}) {
  return (
    <ul className="card-grid gap-3">
      {sospesoList.map((sospeso) => (
        <li key={sospeso.id} aria-labelledby={`to-${sospeso.to}`} className="card bg-base-100 shadow-xl border border-black p-2 relative max-w-60">
          <div className="flex flex-col items-start">
            <span className="font-bold">FROM.</span>
            <span>{sospeso.from}</span>
          </div>
          <time
            dateTime={sospeso.issuedAt.toISOString()}
            className="absolute right-2 top-2 text-xs"
          >
            {format년월일(sospeso.issuedAt)}
          </time>
          <div className="w-full my-4">
            <h3 className="font-bold text-lg" id={`to-${sospeso.to}`}>
              TO. {sospeso.to}
            </h3>
            <div className="h-0.5 w-full bg-black" />
          </div>

          <ul className="list-disc pl-4 text-sm">
            <li>퍼포먼스 1회 코칭 이용권</li>
            <li>신청 후 90일 이내에 사용</li>
          </ul>
          <div className="self-end mt-8 mb-2">
            {sospeso.status === "issued" && (
              isLoggedIn ? (
                <Link
                  className="btn btn-primary"
                  routeKey="소스페소-신청"
                  params={{ sospesoId: sospeso.id }}
                >
                  신청하기
                </Link>
              ) : (
                <Link className="btn btn-primary"
                  routeKey="로그인"
                  params={{}}>
                  신청하기
                </Link>
              )
            )}
            {sospeso.status === "pending" && (
              <StatusStamp>신청자 있음</StatusStamp>
            )}
            {sospeso.status === "consumed" && (
              <StatusStamp>사용함</StatusStamp>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatusStamp({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-[3px] min-w-[78px] border-[#E51516] text-[#E51516] [transform:rotate(-18deg)] text-center">
      <span className="text-[13px] leading-[15.51px]">{children}</span>
    </div>
  );
}
