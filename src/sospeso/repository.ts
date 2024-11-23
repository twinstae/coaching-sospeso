import { TEST_USER } from "@/auth/fixtures";
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
  retrieveSospesoList(page: number): Promise<{
    sospesoList: SospesoListItemDto[];
    totalPage: number;
  }>;
  retrieveSospesoDetail(sospesoId: string): Promise<SospesoDto | undefined>;
  retrieveApplicationList(): Promise<SospesoApplicationListItemDto[]>;
  updateOrSave(
    sospesoId: string,
    update: (sospeso: Sospeso | undefined) => Sospeso,
  ): Promise<void>;
}

export const SOSPESO_PER_PAGE = 10;

export const createFakeSospesoRepository = (
  initState: Record<string, Sospeso> = {},
): SospesoRepositoryI => {
  let _fakeState = initState;

  return {
    async retrieveSospesoList(page) {
      const sospesoList = Object.values(_fakeState).map((sospeso) => {
        const status = calcStatus(sospeso);
        return {
          id: sospeso.id,
          from: sospeso.from,
          status,
          to: sospeso.to,
          issuedAt: sospeso.issuing.issuedAt,
        };
      });

      const start = (page - 1) * SOSPESO_PER_PAGE;
      const end = (page - 1) * SOSPESO_PER_PAGE + SOSPESO_PER_PAGE + 1;
      return {
        sospesoList: sospesoList.slice(start, end),
        totalPage: Math.ceil(sospesoList.length / SOSPESO_PER_PAGE),
      };
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
