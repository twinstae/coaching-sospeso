import invariant from "@/invariant";
import type { UserRepositoryI } from "./repository";

// 회원가입
export async function signup(
  repo: UserRepositoryI,
  command: {
    id: string;
    name: string;
    email: string;
    phone: string;
    nickname: string;
  },
) {
  return repo.updateOrSave(command.id, (existingUser) => {
    invariant(existingUser === undefined, "이미 유저가 있어요!");

    return { ...command, withdrawnAt: undefined };
  });
}

// 로그인?
// 로그아웃

// 사용자 정보 가져오기

// 사용자 정보 변경
export async function changeBio(
  repo: UserRepositoryI,
  userId: string,
  command: { name?: string; phone?: string; nickname?: string },
) {
  return repo.updateOrSave(userId, (existingUser) => {
    invariant(existingUser !== undefined, "정보를 수정할 유저가 없어요!");
    invariant(
      existingUser.withdrawnAt === undefined,
      "이미 탈퇴한 사용자에요!",
    );

    return {
      ...existingUser,
      ...command,
    };
  });
}

// 탈퇴

export async function withdraw(
  repo: UserRepositoryI,
  userId: string,
  withdrawnAt: Date,
) {
  return repo.updateOrSave(userId, (existingUser) => {
    invariant(existingUser !== undefined, "정보를 수정할 유저가 없어요!");

    return {
      id: existingUser.id,
      nickname: existingUser.nickname,
      email: null,
      phone: null,
      name: null,
      withdrawnAt,
    };
  });
}
