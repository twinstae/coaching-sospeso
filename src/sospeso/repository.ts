import { calcStatus, type Sospeso } from "./domain";

type SospesoListItemDto = {
  id: string;
  from: string;
  to: string;
};

type SospesoDto =
  | {
      id: string;
      from: { id: string; nickname: string };
      to: string;
      status: "issued" | "pending";
      consuming: undefined;
    }
  | {
      id: string;
      from: { id: string; nickname: string };
      to: string;
      status: "consumed";
      consuming: {
        consumer: { id: string; nickname: string };
        content: string;
      };
    };
export interface SospesoRepositoryI {
  retrieveSospesoList(): Promise<SospesoListItemDto[]>;
  retrieveSospesoDetail(sospesoId: string): Promise<SospesoDto>;
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
      return Object.values(_fakeState).map((sospeso) => ({
        from: sospeso.from,
        to: sospeso.to,
        id: sospeso.id,
      }));
    },
    async retrieveSospesoDetail(sospesoId) {
      const sospeso = _fakeState[sospesoId];

      if (sospeso === undefined) {
        return undefined;
      }

      // TODO: schema로 정의해서 검증할 것

      return {
        id: sospeso.id,
        from: {
          // TODO! 발행자가 유저 관리와 연결
          id: "1231",
          nickname: "423423",
        },
        status: calcStatus(sospeso),
        to: sospeso.to,
        consuming: sospeso.consuming
          ? {
              // TODO: 사용 담당자가 유저 관리와 연결
              consumer: {
                id: "3231",
                nickname: "촛불이",
              },
              content: "후기..",
            }
          : undefined,
      } as any;
    },
    async updateOrSave(
      sospesoId: string,
      update: (sospeso: Sospeso | undefined) => Sospeso,
    ): Promise<void> {
      _fakeState[sospesoId] = update(_fakeState[sospesoId]);
    },
  };
};
