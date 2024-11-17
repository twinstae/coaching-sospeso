import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { magicLinkLoginBus, LoginForm } from "./LoginForm.tsx";
import { SafeEventHandler } from "@/event/SafeEventHandler.tsx";

const TEST_EMAIL = "taehee.kim@life-lifter.com";

describe("LoginForm", () => {
  test("이메일을 입력하지 않으면 로그인할 수 없다", async () => {
    let result = {}; // mock
    render(
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

    expect(result).toEqual({});
  });

  test("이메일을 입력하면 로그인 이메일을 보낸다", async () => {
    let result = {};
    render(
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
    await queryTL.button("이메일로 계속하기").click();

    expect(result).toEqual({
      email: TEST_EMAIL,
    });
  });
});
