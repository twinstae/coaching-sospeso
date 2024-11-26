import * as v from "valibot";

import { Form } from "@/shared/form/Form.tsx";
import { createSafeEvent } from "@/event/SafeEventBus.ts";
import { passwordSchema } from "@/auth/schema.ts";
import { PasswordInput } from "@/shared/form/PasswordInput";

const resetPasswordSchema = v.object({
  password: passwordSchema,
});

export const resetPasswordBus = createSafeEvent(
  "reset-password",
  resetPasswordSchema,
);

export function ResetPasswordForm() {
  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-4">
      <h2 className="text-2xl font-bold text-center mb-8">비밀번호 변경하기</h2>

      <div className="space-y-4">
        <Form
          className="flex flex-col gap-4"
          form={{
            schema: resetPasswordSchema,
            defaultValues: { password: "" },
            bus: resetPasswordBus,
          }}
        >
          <PasswordInput
            label="새 비밀번호"
            name="password"
            autoComplete="new-password"
          />
          <button className="btn btn-outline w-full" type="submit">
            비밀번호 변경하기
          </button>
        </Form>
      </div>
    </div>
  );
}
