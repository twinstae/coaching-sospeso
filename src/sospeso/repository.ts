import { calcStatus, type Sospeso } from "./domain";

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

type SospesoListItemDto = 
| {
    id: string;
    from: string;
    to: string;
    status: "issued" | "pending" | "consumed";
    issuedAt: Date;
  }

export interface SospesoRepositoryI {
  retrieveSospesoList(): Promise<SospesoListItemDto[]>;
  retrieveSospesoDetail(sospesoId: string): Promise<SospesoDto | undefined>;
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
          issuedAt: sospeso.issuing.issuedAt
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
            // TODO: 사용 담당자가 유저 관리와 연결
            consumer: {
              id: "3231",
              nickname: "촛불이",
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
    async updateOrSave(
      sospesoId: string,
      update: (sospeso: Sospeso | undefined) => Sospeso,
    ): Promise<void> {
      _fakeState[sospesoId] = update(_fakeState[sospesoId]);
    },
  };
};
