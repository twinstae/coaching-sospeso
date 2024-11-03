import { describe, expect, test } from "vitest";
import { createFakeRepository } from "./repository";
import { changeBio, signup, withdraw } from "./service";
import { TEST_USER } from "./fixtures";

describe("sospeso", () => {
  test("회원가입을 할 수 있다", async () => {
    const repo = createFakeRepository();

    await signup(repo, TEST_USER);

    expect(await repo.retrieveUserById(TEST_USER.id)).toEqual(TEST_USER);
  });

  test("이메일이 중복이면 회원가입 할 수 없다", async () => {
    const repo = createFakeRepository({
      "1234": {
        ...TEST_USER,
        nickname: "검은 토끼",
        id: "1234",
      },
    });

    // 회원가입을 하면... 에러가 난다
    const result = await signup(repo, TEST_USER).catch((error) => error);

    expect(result.message).toBe("이미 같은 이메일로 가입되어 있습니다.");
  });

  test("닉네임이 중복이면 회원가입 할 수 없다", async () => {
    const repo = createFakeRepository({
      "1234": {
        ...TEST_USER,
        email: "test@gmail.com",
        id: "1234",
      },
    });

    // 회원가입을 하면... 에러가 난다
    const result = await signup(repo, TEST_USER).catch((error) => error);

    expect(result.message).toBe("이미 같은 닉네임으로 가입되어 있습니다.");
  });

  test("이메일을 제외한 이름, 별명, 전화번호를 변경할 수 있다", async () => {
    const repo = createFakeRepository({ [TEST_USER.id]: TEST_USER });

    await changeBio(repo, TEST_USER.id, {
      name: "김토끼",
      nickname: "검은 토끼",
      phone: "010-1111-2222",
    });

    expect(await repo.retrieveUserById(TEST_USER.id)).toEqual({
        id: TEST_USER.id,
        email: TEST_USER.email,
        name: "김토끼",
        nickname: "검은 토끼",
        phone: "010-1111-2222",
    });
  });

  
  test("탈퇴하면 이름, 전화번호, 이메일이 사라지고, 별명과 id만 남는다", async () => {
    const repo = createFakeRepository({ [TEST_USER.id]: TEST_USER });

    const withdrawnAt = new Date();
    await withdraw(repo, TEST_USER.id, withdrawnAt);

    expect(await repo.retrieveUserById(TEST_USER.id)).toStrictEqual({
        id: TEST_USER.id,
        nickname: TEST_USER.nickname,
        name: null,
        email: null,
        phone: null,
        withdrawnAt
    });
  });
});
