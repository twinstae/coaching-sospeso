import { renderTL } from '@/siheom/renderTL.tsx';
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { magicLinkLoginBus, LoginForm } from "./LoginForm.tsx";
import { SafeEventHandler } from "@/event/SafeEventHandler.tsx";

const TEST_EMAIL = "taehee.kim@life-lifter.com";
const TEST_PASSWORD = crypto.randomUUID();;

describe("LoginForm", () => {
  test("이메일을 입력하지 않으면 로그인할 수 없다", async () => {
    let result = {}; // mock
    renderTL(
      <SafeEventHandler
        bus={magicLinkLoginBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <LoginForm />
      </SafeEventHandler>,
    );

    await queryTL.button("이메일로 계속하기").click();

    await expectTL(queryTL.textbox("이메일")).toHaveErrorMessage(
      "이메일이 없어요",
    );

    await expectTL(queryTL.textbox("비밀번호")).toHaveErrorMessage(
      "최소 10자리 이상이어야해요",
    );

    expect(result).toEqual({});
  });

  test("이메일을 입력하면 로그인 할 수 있다", async () => {
    let result = {};
    renderTL(
      <SafeEventHandler
        bus={magicLinkLoginBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <LoginForm />
      </SafeEventHandler>,
    );

    await queryTL.textbox("이메일").fill(TEST_EMAIL);
    await queryTL.textbox("비밀번호").fill(TEST_PASSWORD);
    await queryTL.button("이메일로 계속하기").click();

    expect(result).toEqual({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
  });
});
