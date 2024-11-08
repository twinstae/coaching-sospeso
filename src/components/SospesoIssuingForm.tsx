import { Form } from "@/shared/form/Form";
import { TextField } from "@/shared/form/TextField";
import * as v from "valibot";

const issuingSchema = v.object({
  from: v.pipe(v.string(), v.minLength(1, "From. 을 입력해주세요")),
  to: v.string(),
});

export function SospesoIssuingForm({
  onSubmit,
}: {
  onSubmit: (command: { from: string; to: string }) => Promise<void>;
}) {
  return (
    <Form
      form={{
        schema: issuingSchema,
        defaultValues: { from: "", to: "" },
        onSubmit,
      }}
    >
      <TextField label="From." name="from" placeholder="ex) 탐정토끼, 김태희" />
      <TextField
        label="To."
        name="to"
        placeholder="ex) 퀴어 문화 축제 올 사람"
      />
      <button className="btn btn-primary" type="submit">
        발행하기
      </button>
    </Form>
  );
}
