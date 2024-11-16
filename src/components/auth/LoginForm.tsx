import * as v from "valibot";

import { Form } from "@/shared/form/Form";
import Github from "@/shared/icons/Github.tsx";
import Google from "@/shared/icons/Google.tsx";
import Twitter from "@/shared/icons/Twitter.tsx";
import { createSafeEvent } from "@/event/SafeEventBus";
import { TextField } from "@/shared/form/TextField";

const loginSchema = v.object({
  email: v.pipe(v.string(), v.email("올바른 이메일 형식을 입력해주세요!")),
});

export const magicLinkLoginBus = createSafeEvent(
  "magic-email-login",
  loginSchema,
);

export function LoginForm() {
  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-32">
      <h2 className="text-2xl font-bold text-center mb-8">로그인</h2>

      <div className="space-y-4">
        <Form
          className="flex flex-col gap-4"
          form={{
            schema: loginSchema,
            defaultValues: { email: "" },
            bus: magicLinkLoginBus,
          }}
        >
          <TextField label="이메일" name="email" />
          <button className="btn btn-outline w-full" type="submit">
            이메일로 계속하기
          </button>
        </Form>

        <div className="divider">OR</div>

        <button className="btn btn-outline w-full">
          <Google className="w-5 h-5" />
          구글로 계속하기
        </button>

        <button className="btn btn-twitter w-full">
          <Twitter className="w-5 h-5" />
          트위터로 계속하기
        </button>

        <button className="btn btn-primary w-full">
          <Github className="w-5 h-5" />
          깃허브로 계속하기
        </button>
      </div>
    </div>
  );
}
