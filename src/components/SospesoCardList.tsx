import { format년월일 } from "@/adapters/dateApi";
import { Link } from "@/routing/Link";
import type { SospesoStatus } from "@/sospeso/domain";

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
    <div className="flex flex-col gap-3" role="list">
      {sospesoList.map((sospeso) => (
        <Link
          routeKey="소스페소-상세"
          params={{ sospesoId: sospeso.id }}
          key={sospeso.id}
        >
          <div
            className="border border-black p-2.5 relative"
            role="listitem"
            aria-labelledby={`to-${sospeso.to}`}
          >
            <div className="flex items-center mb-6">
              <span className="mr-[9px] font-bold">FROM.</span>
              <span>{sospeso.from}</span>
              <time
                aria-label="발행일"
                dateTime={sospeso.issuedAt.toISOString()}
                className="ml-auto text-[11px]"
              >
                {format년월일(sospeso.issuedAt)}
              </time>
            </div>
            <div className="max-w-max">
              <h3 className="mb-[2px] font-bold" id={`to-${sospeso.to}`}>
                <span className="mr-[13px]">TO.</span>
                <span>{sospeso.to}</span>
              </h3>
              <div className="h-[2px] w-full min-w-[220px] bg-black" />
            </div>
            <div className="absolute bottom-3 right-1">
              {sospeso.status === "pending" && (
                <StatusStamp>신청자 있음</StatusStamp>
              )}
              {sospeso.status === "consumed" && (
                <StatusStamp>사용함</StatusStamp>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function StatusStamp({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-[3px] min-w-[78px] border-[#E51516] text-[#E51516] [transform:rotate(-18deg)] text-center">
      <span className="text-[13px] leading-[15.51px]">{children}</span>
    </div>
  );
}
