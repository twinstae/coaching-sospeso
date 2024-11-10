import { TEST_USER } from "@/user/fixtures";
import {
  calcStatus,
  type Sospeso,
  type SospesoApplicationStatus,
} from "./domain";

type SospesoDto =
  | {
      id: string;
      from: string;
      to: string;
      status: "issued" | "pending";
      consuming: undefined;
    }
  | {
      id: string;
      from: string;
      to: string;
      status: "consumed";
      consuming: {
        consumer: { id: string; nickname: string };
        content: string;
      };
    };

type SospesoListItemDto = {
  id: string;
  from: string;
  to: string;
  status: "issued" | "pending" | "consumed";
  issuedAt: Date;
};

type SospesoApplicationListItemDto = {
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

export interface SospesoRepositoryI {
  retrieveSospesoList(): Promise<SospesoListItemDto[]>;
  retrieveSospesoDetail(sospesoId: string): Promise<SospesoDto | undefined>;
  retrieveApplicationList(): Promise<SospesoApplicationListItemDto[]>;
  updateOrSave(
    sospesoId: string,
    update: (sospeso: Sospeso | undefined) => Sospeso,
  ): Promise<void>;
}

export const createFakeRepository = (
  initState: Record<string, Sospeso> = {},
): SospesoRepositoryI => {
  let _fakeState = initState;

  return {
    async retrieveSospesoList(): Promise<SospesoListItemDto[]> {
      return Object.values(_fakeState).map((sospeso) => {
        const status = calcStatus(sospeso);
        return {
          id: sospeso.id,
          from: sospeso.from,
          status,
          to: sospeso.to,
          issuedAt: sospeso.issuing.issuedAt,
        };
      });
    },
    async retrieveSospesoDetail(sospesoId) {
      const sospeso = _fakeState[sospesoId];

      if (sospeso === undefined) {
        return undefined;
      }

      const status = calcStatus(sospeso);

      if (status === "consumed") {
        return {
          id: sospeso.id,
          from: sospeso.from,
          status,
          to: sospeso.to,
          consuming: {
            consumer: {
              id: TEST_USER.id,
              nickname: TEST_USER.nickname,
            },
            content: "후기..",
          },
        };
      }

      return {
        id: sospeso.id,
        from: sospeso.from,
        status,
        to: sospeso.to,
        consuming: undefined,
      };
    },
    async retrieveApplicationList(): Promise<SospesoApplicationListItemDto[]> {
      return Object.values(_fakeState).flatMap((sospeso) => {
        return sospeso.applicationList.map((application) => {
          return {
            id: application.id,
            sospesoId: sospeso.id,
            to: sospeso.to,
            status: application.status,
            appliedAt: application.appliedAt,
            content: application.content,
            applicant: {
              // TODO! user가 만들어져야
              id: TEST_USER.id,
              nickname: TEST_USER.nickname,
            },
          };
        });
      });
    },
    async updateOrSave(
      sospesoId: string,
      update: (sospeso: Sospeso | undefined) => Sospeso,
    ): Promise<void> {
      _fakeState[sospesoId] = update(_fakeState[sospesoId]);
    },
  };
};
