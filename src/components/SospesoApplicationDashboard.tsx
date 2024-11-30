import { createSafeEvent } from "@/event/SafeEventBus";
import { Link } from "@/routing/Link.tsx";
import { type SospesoApplicationStatus } from "@/sospeso/domain.ts";
import { applicationStatusToLabelDict } from "@/sospeso/label.ts";
import { clsx } from "clsx";
import * as v from "valibot";

export type SospesoApplicationDto = {
  id: string;
  sospesoId: string;
  to: string;
  status: SospesoApplicationStatus;
  appliedAt: Date;
  applicant: {
    id: string;
    nickname: string;
  };
  content: string;
};

const detailSchema = v.object({
  sospesoId: v.string(),
  applicationId: v.string(),
});

export const sospesoApproveEventBus = createSafeEvent(
  "sospeso-approve",
  detailSchema,
);
export const sospesoRejectEventBus = createSafeEvent(
  "sospeso-reject",
  detailSchema,
);

export const SospesoApplicationDashboard = ({
  applicationList,
}: {
  applicationList: SospesoApplicationDto[];
}) => {
  return (
    <div className="overflow-x-auto card shadow-lg min-h-96">
      <h1 className="text-page-title">소스페소 신청 현황</h1>
      <table className="table">
        <thead>
          <tr className="bg-primary text-primary-content">
            <th>수혜자 조건</th>
            <th>신청한 날짜</th>
            <th>신청한 사람</th>
            <th>내용</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {applicationList.map((application) => (
            <tr key={application.id}>
              <td>{application.to}</td>
              <td>{application.appliedAt.toDateString()}</td>
              <td>{application.applicant.nickname}</td>
              <td>{application.content}</td>
              <td>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className={clsx(
                      "badge",
                      application.status === "rejected" && "badge-error",
                      application.status === "approved" && "badge-success",
                      application.status === "applied" && "badge-info",
                    )}
                  >
                    {applicationStatusToLabelDict[application.status]}
                  </div>
                  {(application.status === "applied" ||
                    application.status === "approved") && (
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                    >
                      {application.status === "applied" && (
                        <li>
                          <button
                            type="button"
                            onClick={(event) => {
                              sospesoApproveEventBus.dispatch(
                                event.currentTarget,
                                {
                                  sospesoId: application.sospesoId,
                                  applicationId: application.id,
                                },
                              );
                            }}
                          >
                            승인하기
                          </button>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={(event) => {
                            sospesoRejectEventBus.dispatch(
                              event.currentTarget,
                              {
                                sospesoId: application.sospesoId,
                                applicationId: application.id,
                              },
                            );
                          }}
                        >
                          거절하기
                        </button>
                      </li>
                      {application.status === "approved" && (
                        <li>
                          <Link
                            routeKey="어드민-소스페소-사용"
                            params={{
                              sospesoId: application.sospesoId,
                              consumerId: application.applicant.id,
                            }}
                          >
                            사용하기
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
