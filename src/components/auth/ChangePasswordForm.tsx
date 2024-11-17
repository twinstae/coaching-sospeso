import * as v from "valibot";

import { Form } from "@/shared/form/Form.tsx";
import { createSafeEvent } from "@/event/SafeEventBus.ts";
import { TextField } from "@/shared/form/TextField.tsx";
import { emailSchema } from "@/auth/schema.ts";

const changePasswordSchema = v.object({
  email: emailSchema,
});

export const changePasswordBus = createSafeEvent(
  "change-password",
  changePasswordSchema,
);

export function ChangePasswordForm() {
  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-32">
      <h2 className="text-2xl font-bold text-center mb-8">비밀번호 변경하기</h2>

      <div className="space-y-4">
        <Form
          className="flex flex-col gap-4"
          form={{
            schema: changePasswordSchema,
            defaultValues: { email: "" },
            bus: changePasswordBus,
          }}
        >
          <TextField label="이메일" name="email" autoComplete="email" />
          <button className="btn btn-outline w-full" type="submit">
            비밀번호 변경 이메일 보내기
          </button>
        </Form>
      </div>
    </div>
  );
}
