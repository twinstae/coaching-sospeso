import { renderTL } from "@/siheom/renderTL.tsx";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { SafeEventHandler } from "@/event/SafeEventHandler.tsx";
import { updateUserBus, UpdateUserForm } from "./UpdateUserForm.tsx";

const TEST_USER: { name: string; nickname: string; phone: string } = {
  name: "park",
  phone: "010-1111-1111",
  nickname: "tester",
};

describe("UpdateUserForm", () => {
  test("별명이 빈칸이면 제출할 수 없다", async () => {
    let result = {}; // mock

    renderTL(
      <SafeEventHandler
        bus={updateUserBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <UpdateUserForm user={TEST_USER} />
      </SafeEventHandler>,
    );

    await queryTL.textbox("별명").clear();
    await queryTL.button("프로필 수정하기").click();

    await expectTL(queryTL.textbox("별명")).toHaveErrorMessage(
      "별명을 꼭 입력해주세요",
    );

    expect(result).toEqual({});
  });

  test("이름(실명)이 빈칸이면 제출할 수 없다", async () => {
    let result = {}; // mock

    renderTL(
      <SafeEventHandler
        bus={updateUserBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <UpdateUserForm user={TEST_USER} />
      </SafeEventHandler>,
    );

    await queryTL.textbox("이름(실명)").clear();
    await queryTL.button("프로필 수정하기").click();

    await expectTL(queryTL.textbox("이름(실명)")).toHaveErrorMessage(
      "실명이 꼭 있어야 해요",
    );

    expect(result).toEqual({});
  });

  test("전화번호가 빈칸이면 제출할 수 없다", async () => {
    let result = {}; // mock

    renderTL(
      <SafeEventHandler
        bus={updateUserBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <UpdateUserForm user={TEST_USER} />
      </SafeEventHandler>,
    );

    await queryTL.textbox("전화번호").clear();
    await queryTL.button("프로필 수정하기").click();

    await expectTL(queryTL.textbox("전화번호")).toHaveErrorMessage(
      "010-1234-5678 같은 휴대폰 번호를 입력해주세요",
    );

    expect(result).toEqual({});
  });

  test("수정할 정보를 입력하면 해당 정보로 수정할 수 있다", async () => {
    let result = {};
    renderTL(
      <SafeEventHandler
        bus={updateUserBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <UpdateUserForm user={TEST_USER} />
      </SafeEventHandler>,
    );

    await queryTL.textbox("이름(실명)").fill("홍길동");
    await queryTL.textbox("전화번호").fill("010-1234-5678");
    await queryTL.textbox("별명").fill("김토끼");

    await queryTL.button("프로필 수정하기").click();

    expect(result).toEqual({
      nickname: "김토끼",
      name: "홍길동",
      phone: "010-1234-5678",
    });
  });
});
