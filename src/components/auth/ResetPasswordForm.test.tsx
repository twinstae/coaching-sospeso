import { renderTL } from "@/siheom/renderTL.tsx";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { resetPasswordBus, ResetPasswordForm } from "./ResetPasswordForm.tsx";
import { SafeEventHandler } from "@/event/SafeEventHandler.tsx";

const TEST_PASSWORD = crypto.randomUUID();

describe("ResetPasswordForm", () => {
  test("이메일을 입력하지 않으면 로그인할 수 없다", async () => {
    let result = {}; // mock
    renderTL(
      <SafeEventHandler
        bus={resetPasswordBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <ResetPasswordForm />
      </SafeEventHandler>,
    );

    await queryTL.button("비밀번호 변경하기").click();

    await expectTL(queryTL.textbox("새 비밀번호")).toHaveErrorMessage(
      "최소 10자리 이상이어야해요",
    );

    expect(result).toEqual({});
  });

  test("이메일을 입력하면 로그인 할 수 있다", async () => {
    let result = {};
    renderTL(
      <SafeEventHandler
        bus={resetPasswordBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <ResetPasswordForm />
      </SafeEventHandler>,
    );

    await queryTL.textbox("새 비밀번호").fill(TEST_PASSWORD);
    await queryTL.button("비밀번호 변경하기").click();

    expect(result).toEqual({
      password: TEST_PASSWORD,
    });
  });
});
