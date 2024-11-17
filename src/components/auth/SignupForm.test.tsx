import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { signUpBus, SignUpForm } from "./SignUpForm.tsx";
import { SafeEventHandler } from "@/event/SafeEventHandler.tsx";
import { getA11ySnapshot } from "@/siheom/getA11ySnapshot.ts";
import { renderTL } from '@/siheom/renderTL.tsx';

const TEST_EMAIL = "taehee.kim@life-lifter.com";

describe("SignUpForm", () => {
  test("필수 정보를 모두 입력하지 않으면 회원가입 할 수 없다", async () => {
    let result = {}; // mock
    renderTL(
      <SafeEventHandler
        bus={signUpBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <SignUpForm />
      </SafeEventHandler>,
    );

    await queryTL.button("회원가입하기").click();

    expect(getA11ySnapshot(document.body)).toMatchInlineSnapshot(`
      "heading: "회원가입"  
      form  
        textbox: "이메일"  [value=]
        alert [text="이메일이 없어요"] 
        textbox: "비밀번호"  [value=]
        alert [text="최소 10자리 이상이어야해요"] 
        textbox: "비밀번호 확인"  [value=]
        alert [text="최소 10자리 이상이어야해요"] 
        textbox: "이름(실명)"  [value=]
        alert [text="실명이 꼭 있어야 해요"] 
        textbox: "전화번호"  [value=]
        alert [text="010-1234-5678 같은 휴대폰 번호를 입력해주세요"] 
        textbox: "별명"  [value=]
        alert [text="별명을 꼭 입력해주세요"] 
        button: "회원가입하기""
    `);

    expect(result).toEqual({});
  });

  test("비밀번호가 다르면 회원가입할 수 없다", async () => {
    let result = {}; // mock
    renderTL(
      <SafeEventHandler
        bus={signUpBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <SignUpForm />
      </SafeEventHandler>,
    );

    await queryTL.textbox("이메일").fill(TEST_EMAIL);

    await queryTL.textbox("비밀번호").fill("!1q2w3e4r!");
    await queryTL.textbox("비밀번호 확인").fill("@1q2w3e4r@");

    await queryTL.textbox("이름(실명)").fill("김태희");
    await queryTL.textbox("전화번호").fill("010-4827-1733");
    await queryTL.textbox("별명").fill("김토끼");

    await queryTL.button("회원가입하기").click();

    await expectTL(queryTL.textbox("비밀번호 확인")).toHaveErrorMessage(
      "두 비밀번호가 다릅니다",
    );

    expect(result).toEqual({});
  });

  test("필수 정보를 모두 입력하면 회원가입할 수 있다", async () => {
    let result = {};
    renderTL(
      <SafeEventHandler
        bus={signUpBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <SignUpForm />
      </SafeEventHandler>,
    );

    await queryTL.textbox("이메일").fill(TEST_EMAIL);

    await queryTL.textbox("비밀번호").fill("!1q2w3e4r!");
    await queryTL.textbox("비밀번호 확인").fill("!1q2w3e4r!");

    await queryTL.textbox("이름(실명)").fill("김태희");
    await queryTL.textbox("전화번호").fill("010-4827-1733");
    await queryTL.textbox("별명").fill("김토끼");

    await queryTL.button("회원가입하기").click();
    await queryTL.button("회원가입하기").click();

    expect(result).toEqual({
      email: TEST_EMAIL,
      name: "김태희",
      nickname: "김토끼",
      password: "!1q2w3e4r!",
      passwordAgain: "!1q2w3e4r!",
      phone: "010-4827-1733",
    });
  });
});
