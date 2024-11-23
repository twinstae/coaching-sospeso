import * as v from "valibot";

import { Form } from "@/shared/form/Form.tsx";
import { createSafeEvent } from "@/event/SafeEventBus.ts";
import { TextField } from "@/shared/form/TextField.tsx";
import { Checkbox } from "@/shared/form/Checkbox.tsx";
import { emailSchema, passwordSchema, phoneSchema } from "@/auth/schema";
import { Link } from "@/routing/Link";

const signUpSchema = v.pipe(
  v.object({
    email: emailSchema,
    password: passwordSchema,
    passwordAgain: passwordSchema,
    name: v.pipe(v.string(), v.minLength(1, "실명이 꼭 있어야 해요")),
    phone: phoneSchema,
    nickname: v.pipe(v.string(), v.minLength(1, "별명을 꼭 입력해주세요")),
    usage: v.boolean(),
    privacy: v.boolean(),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["passwordAgain"]],
      (input) => input.password === input.passwordAgain,
      "두 비밀번호가 다릅니다",
    ),
    ["passwordAgain"],
  ),
  v.forward(
    v.partialCheck(
      [["usage"]],
      (input) => input.usage === true,
      "약관에 동의하지 않으면 가입할 수 없습니다",
    ),
    ["usage"],
  ),
  v.forward(
    v.partialCheck(
      [["privacy"]],
      (input) => input.privacy === true,
      "개인청보처리방침에 동의하지 않으면 가입할 수 없습니다",
    ),
    ["privacy"],
  ),
);

export const signUpBus = createSafeEvent("SignUp", signUpSchema);

export function SignUpForm() {
  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-4">
      <h2 className="text-2xl font-bold text-center mb-8">회원가입</h2>

      <div className="space-y-4">
        <Form
          className="flex flex-col gap-4"
          form={{
            schema: signUpSchema,
            defaultValues: {
              email: "",
              password: "",
              passwordAgain: "",
              name: "",
              phone: "",
              nickname: "",
              usage: false,
              privacy: false,
            },
            bus: signUpBus,
          }}
        >
          <TextField
            label="이메일"
            name="email"
            autoComplete="email"
            placeholder="gildong@gmail.com"
          />
          <TextField
            label="비밀번호"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={10}
          />
          <TextField
            label="비밀번호 확인"
            name="passwordAgain"
            type="password"
            autoComplete="new-password"
            minLength={10}
          />
          <TextField
            label="이름(실명)"
            name="name"
            autoComplete="name"
            placeholder="홍길동"
          />
          <TextField
            label="전화번호"
            name="phone"
            placeholder="010-1234-5678"
            autoComplete="tel-national"
          />
          <TextField label="별명" name="nickname" placeholder="다정한 토끼" />

          <Checkbox
            label={
              <>
                <Link
                  className="link link-primary hover:bg-base-200 rounded cursor-pointer transition-colors h-full py-1 px-2 -mx-1"
                  routeKey={"이용약관"}
                  params={undefined}
                  target='_blank'
                >이용약관 <span className="text-red-600">(필수)</span>
                </Link>
              </>
            }
            name="usage"
          />
          <Checkbox
            label={
              <>
                <Link
                  className="link link-primary hover:bg-base-200 rounded cursor-pointer transition-colors h-full py-1 px-2 -mx-1"
                  routeKey={"개인정보처리방침"}
                  params={undefined}
                  target='_blank'
                >
                  개인정보처리방침 <span className="text-red-600">(필수)</span>
                </Link>
              </>
            }
            name="privacy"
          />

          <button className="btn btn-primary w-full" type="submit">
            회원가입하기
          </button>
        </Form>
      </div>
    </div>
  );
}
