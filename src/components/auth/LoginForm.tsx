import * as v from "valibot";

import { Form } from "@/shared/form/Form.tsx";
import Github from "@/shared/icons/Github.tsx";
import Google from "@/shared/icons/Google.tsx";
import Twitter from "@/shared/icons/Twitter.tsx";
import { createSafeEvent } from "@/event/SafeEventBus.ts";
import { TextField } from "@/shared/form/TextField.tsx";
import { Link } from "@/routing/Link.tsx";
import { emailSchema, passwordSchema } from "@/auth/schema.ts";
import { authApi } from "@/adapters/authApi.ts";
import { SimpleErrorMessage } from "@/shared/form/SimpleErrorMessage";
import { PasswordInput } from "@/shared/form/PasswordInput";

const loginSchema = v.object({
  email: emailSchema,
  password: passwordSchema,
});

export const magicLinkLoginBus = createSafeEvent(
  "magic-email-login",
  loginSchema,
);

export function LoginForm({ error }: { error: "email_not_found" | undefined }) {
  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-4">
      <h2 className="text-2xl font-bold text-center mb-8">로그인</h2>

      <div className="space-y-4">
        <Form
          className="flex flex-col gap-4"
          form={{
            schema: loginSchema,
            defaultValues: { email: "", password: "" },
            bus: magicLinkLoginBus,
          }}
        >
          <TextField label="이메일" name="email" autoComplete="email" />
          <PasswordInput
            label="비밀번호"
            name="password"
            autoComplete="current-password"
          />
          <button className="btn btn-outline w-full" type="submit">
            이메일로 계속하기
          </button>
        </Form>

        <div className="grid grid-cols-2">
          <Link
            routeKey="회원가입"
            params={{}}
            className="link self-center m-auto"
          >
            회원가입
          </Link>

          <Link
            routeKey="비밀번호-변경-이메일"
            params={{}}
            className="link self-center m-auto"
          >
            비밀번호 변경하기
          </Link>
        </div>

        <div className="divider">OR</div>

        {error && (
          <SimpleErrorMessage
            id={"login-error"}
            error={{
              message:
                error === "email_not_found"
                  ? "이메일이 없어 가입하지 못했습니다"
                  : "알 수 없는 에러",
            }}
          />
        )}

        <button
          className="btn btn-outline w-full"
          onClick={() => {
            authApi.login.google();
          }}
        >
          <Google className="w-5 h-5" />
          구글로 계속하기
        </button>

        <button
          className="btn btn-twitter w-full"
          onClick={() => {
            authApi.login.twitter();
          }}
        >
          <Twitter className="w-5 h-5" />
          트위터로 계속하기
        </button>

        <button
          className="btn btn-primary w-full"
          onClick={() => {
            authApi.login.github();
          }}
        >
          <Github className="w-5 h-5" />
          깃허브로 계속하기
        </button>
      </div>
    </div>
  );
}
