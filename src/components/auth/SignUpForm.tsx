import * as v from "valibot";

import { Form } from "@/shared/form/Form.tsx";
import { createSafeEvent } from "@/event/SafeEventBus.ts";
import { TextField } from "@/shared/form/TextField.tsx";

const signUpSchema = v.pipe(
  v.object({
    email: v.pipe(v.string(), v.email("올바른 이메일 형식을 입력해주세요!")),
    password: v.pipe(
      v.string(),
      v.minLength(10, "비밀번호는 최소 10자리 이상 입력해주세요"),
      v.regex(/[0-9]/i, "숫자를 적어도 하나 이상 포함해주세요"),
      v.regex(/[a-zA-Z]/i, "영문자를 적어도 하나 이상 포함해주세요"),
      v.regex(/[\W_]/i, "특수문자를 적어도 하나 이상 포함해주세요"),
    ),
    passwordAgain: v.pipe(
      v.string(),
      v.minLength(10, "비밀번호는 최소 10자리 이상 입력해주세요"),
      v.regex(/[0-9]/i, "숫자를 적어도 하나 이상 포함해주세요"),
      v.regex(/[a-zA-Z]/i, "영문자를 적어도 하나 이상 포함해주세요"),
      v.regex(/[\W_]/i, "특수문자를 적어도 하나 이상 포함해주세요"),
    ),
    name: v.pipe(v.string(), v.minLength(1, "이름을 꼭 입력해주세요")),
    phone: v.pipe(
      v.string(),
      v.regex(
        /[0-9]{3}-[0-9]{4}-[0-9]{4}/,
        "010-1234-5678 같은 휴대폰 번호를 입력해주세요",
      ),
    ),
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
            defaultValues: { email: "" },
            bus: signUpBus,
          }}
        >
          <TextField label="이메일" name="email" />
          <TextField label="비밀번호" name="password" type="password" />
          <TextField
            label="비밀번호 확인"
            name="passwordAgain"
            type="password"
          />
          <TextField label="이름(실명)" name="name" />
          <TextField label="전화번호" name="phone" />
          <TextField label="별명" name="nickname" />

          <button className="btn btn-primary w-full" type="submit">
            회원가입하기
          </button>
        </Form>
      </div>
    </div>
  );
}
