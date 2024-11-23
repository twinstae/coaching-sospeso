import { renderTL } from "@/siheom/renderTL.tsx";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { SafeEventHandler } from "@/event/SafeEventHandler.tsx";
import { updateUserBus, UpdateUserForm } from "./UpdateUserForm.tsx";

const TEST_USER: { id: string; nickname: string; role: "user" | "admin" } = {
  id: "123",
  nickname: "tester",
  role: "user",
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
        <UpdateUserForm user={undefined} />
      </SafeEventHandler>,
    );

    await queryTL.button("프로필 수정하기").click();

    await expectTL(queryTL.textbox("별명")).toHaveErrorMessage(
      "별명을 꼭 입력해주세요",
    );

    expect(result).toEqual({});
  });

  test("별명을 입력하면 해당 별명으로 수정할 수 있다", async () => {
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

    await queryTL.textbox("별명").fill("김토끼");
    await queryTL.button("프로필 수정하기").click();

    expect(result).toEqual({
      nickname: "김토끼",
    });
  });
});
