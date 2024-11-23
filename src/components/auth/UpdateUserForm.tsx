import * as v from "valibot";

import { Form } from "@/shared/form/Form";
import { TextField } from "@/shared/form/TextField";
import { createSafeEvent } from "@/event/SafeEventBus";

const updateUserSchema = v.object({
  nickname: v.pipe(v.string(), v.minLength(1, "별명을 꼭 입력해주세요")),
});

export const updateUserBus = createSafeEvent("UpdateUser", updateUserSchema);

export function UpdateUserForm({
  user,
}: {
  user:
    | {
        id: string;
        nickname: string;
        role: "user" | "admin";
      }
    | undefined;
}) {
  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-4">
      <h2 className="text-2xl font-bold text-center mb-8">프로필 수정</h2>

      <div className="space-y-4">
        <Form
          className="flex flex-col gap-4"
          form={{
            schema: updateUserSchema,
            defaultValues: {
              nickname: user ? user.nickname : "",
            },
            bus: updateUserBus,
          }}
        >
          <TextField label="별명" name="nickname" placeholder="다정한 토끼" />
          <button className="btn btn-primary w-full" type="submit">
            프로필 수정하기
          </button>
        </Form>
      </div>
    </div>
  );
}
