// 글자수 제한 중요!
export type User =
  | {
      id: string;
      name: string;
      email: string;
      phone: string;
      nickname: string;
      withdrawnAt: undefined;
    }
  | { // 탈퇴한 유저
      id: string;
      nickname: string;

      name: null;
      email: null;
      phone: null;

      withdrawnAt: Date;
    };
