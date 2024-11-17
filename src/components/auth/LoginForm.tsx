import * as v from "valibot";

import { Form } from "@/shared/form/Form.tsx";
import Github from "@/shared/icons/Github.tsx";
import Google from "@/shared/icons/Google.tsx";
import Twitter from "@/shared/icons/Twitter.tsx";
import { createSafeEvent } from "@/event/SafeEventBus.ts";
import { TextField } from "@/shared/form/TextField.tsx";
import { Link } from "@/routing/Link.tsx";
import { emailSchema } from '@/auth/schema.ts';

const loginSchema = v.object({
  email: emailSchema,
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
          <TextField label="이메일" name="email" autoComplete="email" />
          <button className="btn btn-outline w-full" type="submit">
            이메일로 계속하기
          </button>
        </Form>

        <Link
          routeKey="회원가입"
          params={undefined}
          className="link self-center m-auto"
        >
          회원가입
        </Link>

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
