import { renderTL } from "@/siheom/renderTL.tsx";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import {
  changePasswordBus,
  ChangePasswordForm,
} from "./ChangePasswordForm.tsx";
import { SafeEventHandler } from "@/event/SafeEventHandler.tsx";

const TEST_EMAIL = "taehee.kim@life-lifter.com";

describe("ChangePasswordForm", () => {
  test("이메일을 입력하지 않으면 이메일을 보낼 수 없다", async () => {
    let result = {}; // mock
    renderTL(
      <SafeEventHandler
        bus={changePasswordBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <ChangePasswordForm />
      </SafeEventHandler>,
    );

    await queryTL.button("비밀번호 변경 이메일 보내기").click();

    await expectTL(queryTL.textbox("이메일")).toHaveErrorMessage(
      "이메일이 없어요",
    );

    expect(result).toEqual({});
  });

  test("이메일을 입력하면 비밀번호 변경 인증 이메일을 보낸다", async () => {
    let result = {};
    renderTL(
      <SafeEventHandler
        bus={changePasswordBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <ChangePasswordForm />
      </SafeEventHandler>,
    );

    await queryTL.textbox("이메일").fill(TEST_EMAIL);
    await queryTL.button("비밀번호 변경 이메일 보내기").click();

    expect(result).toEqual({
      email: TEST_EMAIL,
    });
  });
});
