import type { User } from "./domain";

type UserDto = User;

export interface UserRepositoryI {
  retrieveUserById(userId: string): Promise<UserDto | undefined>;
  updateOrSave(
    userId: string,
    update: (sospeso: User | undefined) => User,
  ): Promise<void>;
}

export const createFakeRepository = (
  initState: Record<string, User> = {},
): UserRepositoryI => {
  let _fakeState = initState;

  return {
    async retrieveUserById(userId) {
      return _fakeState[userId];
    },
    async updateOrSave(
      userId: string,
      update: (user: User | undefined) => User,
    ): Promise<void> {
      const oldUser = _fakeState[userId];
      const updatedUser = update(oldUser);

      const userList = Object.values(_fakeState);
      const emailList = userList.map((user) => user.email);
      const nicknameList = userList.map((user) => user.nickname);

      if (oldUser === undefined && emailList.includes(updatedUser.email)) {
        throw Error("이미 같은 이메일로 가입되어 있습니다.");
      }

      if (
        oldUser === undefined &&
        nicknameList.includes(updatedUser.nickname)
      ) {
        throw Error("이미 같은 닉네임으로 가입되어 있습니다.");
      }

      _fakeState[userId] = updatedUser;
    },
  };
};
