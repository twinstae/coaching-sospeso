import { createSafeEvent } from "@/event/SafeEventBus";
import { Form } from "@/shared/form/Form.tsx";
import { Textarea } from "@/shared/form/Textarea.tsx";
import { TextField } from "@/shared/form/TextField.tsx";
import * as v from "valibot";

const consumingSchema = v.object({
  coachId: v.string("코치를 선택해주세요"),
  consumedAt: v.pipe(
    v.string("코칭 일시를 입력해주세요"),
    v.transform((input) => new Date(input)),
  ),
  content: v.pipe(v.string(), v.minLength(1, "후기를 입력해주세요")),
  memo: v.pipe(v.string(), v.minLength(1, "메모를 입력해주세요")),
});

export const sospesoConsumingEventBus = createSafeEvent(
  "sospeso-consume",
  consumingSchema,
);

export function SospesoConsumingForm() {
  return (
    <Form
      form={{
        schema: consumingSchema,
        bus: sospesoConsumingEventBus,
        defaultValues: {
          content: "",
          memo: "",
        },
      }}
    >
      <TextField
        label="코치"
        name="coachId"
        placeholder="ex) 탐정토끼, 김태희"
      />
      <TextField label="코칭일시" name="consumedAt" placeholder="2024-01-01" />

      <Textarea label="후기" name="content" placeholder="" />

      <Textarea label="메모" name="memo" placeholder="" />

      <button className="btn btn-primary" type="submit">
        소스페소 사용하기
      </button>
    </Form>
  );
}
