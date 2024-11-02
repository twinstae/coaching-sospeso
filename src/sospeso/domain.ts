import invariant from "../invariant";

type SospesoIssuing = {
  id: string;

  issuedAt: Date;
};

type SospesoApplication = {
  id: string;
  status: "applied" | "approved" | "rejected";

  appliedAt: Date;
};

type SospesoUsing = {
  id: string;

  usedAt: Date;
};

type Sospeso = {
  id: string;
  issuing: SospesoIssuing;
  applicationList: SospesoApplication[];
  using: SospesoUsing | undefined;
};

type SospesoIssuingCommand = {
  sospesoId: string;
  issuedAt: Date;
};

/**
 * 소스페소를 발행합니다
 * @param command
 * @returns 발행된 소스페소
 */
export function issueSospeso(command: SospesoIssuingCommand): Sospeso {
  return {
    id: command.sospesoId,
    issuing: {
      id: command.sospesoId,
      issuedAt: command.issuedAt,
    },
    applicationList: [],
    using: undefined,
  };
}

type SospesoApplicationCommand = {
  sospesoId: string;
  applicationId: string;
  appliedAt: Date;
};

function isApplicationLocked(sospeso: Sospeso){
    return sospeso.applicationList.some(application => application.status === 'applied' || application.status === 'approved')
}

export function applySospeso(
  sospeso: Sospeso,
  command: SospesoApplicationCommand,
): Sospeso {
  invariant(sospeso.id === command.sospesoId);

  if (isApplicationLocked(sospeso)){
    throw new Error("[Conflict Error] 소스페소를 이미 신청한 사람이 있습니다.")
  }

  return {
    ...sospeso,
    applicationList: [
      ...sospeso.applicationList,
      {
        id: command.applicationId,
        appliedAt: command.appliedAt,
        status: "applied",
      },
    ],
  };
}

export function isUsed(sospeso: Sospeso) {
  return sospeso.using !== undefined;
}
