import { type SospesoApplicationStatus } from "@/sospeso/domain.ts";
import { applicationStatusToLabelDict } from "@/sospeso/label.ts";
import { clsx } from "clsx";

export function SospesoApplicationDashboard({
  applicationList,
  actions,
}: {
  applicationList: {
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
  }[];
  actions: {
    approveApplication: (command: {
      sospesoId: string;
      applicationId: string;
    }) => Promise<void>;
    rejectApplication: (command: {
      sospesoId: string;
      applicationId: string;
    }) => Promise<void>;
  };
}) {
  return (
    <div className="overflow-x-auto card shadow-lg min-h-96">
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
            <tr>
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
                            onClick={() => {
                              actions.approveApplication({
                                sospesoId: application.sospesoId,
                                applicationId: application.id,
                              });
                            }}
                          >
                            승인하기
                          </button>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={() => {
                            actions.rejectApplication({
                              sospesoId: application.sospesoId,
                              applicationId: application.id,
                            });
                          }}
                        >
                          거절하기
                        </button>
                      </li>
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
}

export function SospesoApplicationDashboardWithActions({
  applicationList,
}: {
  applicationList: {
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
  }[];
}) {
  return (
    <SospesoApplicationDashboard
      applicationList={applicationList}
      actions={{
        approveApplication: async () => {
          // TODO! 실제 action 연결해줘야 함
        },
        rejectApplication: async () => {
          // TODO! 실제 action 연결해줘야 함
        },
      }}
    />
  );
}
