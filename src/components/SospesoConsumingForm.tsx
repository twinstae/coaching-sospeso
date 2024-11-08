import { Form } from "@/shared/form/Form";
import { Textarea } from '@/shared/form/Textarea';
import { TextField } from "@/shared/form/TextField";
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

export function SospesoConsumingForm({
  onSubmit,
}: {
  onSubmit: (command: {
    coachId: string;
    consumedAt: Date;
    content: string;
    memo: string;
  }) => Promise<void>;
}) {
  return (
    <Form
      form={{
        schema: consumingSchema,
        defaultValues: {
          content: "",
          memo: "",
        },
        onSubmit,
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
