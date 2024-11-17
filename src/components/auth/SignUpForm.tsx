import * as v from "valibot";

import { Form } from "@/shared/form/Form.tsx";
import { createSafeEvent } from "@/event/SafeEventBus.ts";
import { TextField } from "@/shared/form/TextField.tsx";
import { emailSchema, passwordSchema, phoneSchema } from "@/auth/schema";

const signUpSchema = v.pipe(
  v.object({
    email: emailSchema,
    password: passwordSchema,
    passwordAgain: passwordSchema,
    name: v.pipe(v.string(), v.minLength(1, "실명이 꼭 있어야 해요")),
    phone: phoneSchema,
    nickname: v.pipe(v.string(), v.minLength(1, "별명을 꼭 입력해주세요")),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["passwordAgain"]],
      (input) => input.password === input.passwordAgain,
      "두 비밀번호가 다릅니다",
    ),
    ["passwordAgain"],
  ),
);

export const signUpBus = createSafeEvent("SignUp", signUpSchema);

export function SignUpForm() {
  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-32">
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
          <TextField label="이름(실명)" name="name" autoComplete="name" />
          <TextField
            label="전화번호"
            name="phone"
            autoComplete="tel-national"
          />
          <TextField label="별명" name="nickname" />

          <button className="btn btn-primary w-full" type="submit">
            회원가입하기
          </button>
        </Form>
      </div>
    </div>
  );
}
