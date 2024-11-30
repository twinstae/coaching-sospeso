import * as v from "valibot";

import { Form } from "@/shared/form/Form";
import { TextField } from "@/shared/form/TextField";
import { createSafeEvent } from "@/event/SafeEventBus";
import { phoneSchema } from "@/auth/schema";
import { PhoneField } from "@/shared/form/PhoneField";

const updateUserSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "실명이 꼭 있어야 해요")),
  phone: phoneSchema,
  nickname: v.pipe(v.string(), v.minLength(1, "별명을 꼭 입력해주세요")),
});

export const updateUserBus = createSafeEvent("UpdateUser", updateUserSchema);

export function UpdateUserForm({
  user,
}: {
  user: {
    name: string;
    nickname: string;
    phone: string;
  };
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
              name: user.name,
              nickname: user.nickname,
              phone: user.phone,
            },
            bus: updateUserBus,
          }}
        >
          <TextField
            label="이름(실명)"
            name="name"
            autoComplete="name"
            placeholder="홍길동"
          />
          <TextField label="별명" name="nickname" placeholder="다정한 토끼" />
          <PhoneField
            label="전화번호"
            name="phone"
            placeholder="010-1234-5678"
            autoComplete="tel-national"
          />
          <button className="btn btn-primary w-full" type="submit">
            프로필 수정하기
          </button>
        </Form>
      </div>
    </div>
  );
}
