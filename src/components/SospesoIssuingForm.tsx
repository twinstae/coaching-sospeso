import { generateNanoId, type generateIdI } from "@/adapters/generateId";
import { createSafeEvent } from "@/event/SafeEventBus";
import { Form } from "@/shared/form/Form";
import { TextField } from "@/shared/form/TextField";
import { useMemo } from "react";
import * as v from "valibot";

const issuingSchema = v.object({
  sospesoId: v.string(),
  from: v.pipe(v.string(), v.minLength(1, "From. 을 입력해주세요")),
  to: v.string(),
});

export const sospesoIssuingEventBus = createSafeEvent(
  "sospeso-issuing",
  issuingSchema,
);

export function SospesoIssuingForm({
  generateId = generateNanoId,
  userNickname,
}: {
  generateId?: generateIdI;
  userNickname: string;
}) {
  const id = useMemo(() => generateId(), [generateId]);

  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-4">
      <Form
        className="flex flex-col gap-4"
        form={{
          schema: issuingSchema,
          defaultValues: { sospesoId: id, from: userNickname, to: "" },
          bus: sospesoIssuingEventBus,
        }}
      >
        <TextField
          label="From."
          name="from"
          placeholder="ex) 탐정토끼, 김태희"
          maxLength={12}
        />
        <TextField
          label="To."
          name="to"
          placeholder="ex) 퀴어 문화 축제 올 사람"
          maxLength={24}
        />

        <button className="btn btn-primary w-full" type="submit">
          발행하기
        </button>
      </Form>
    </div>
  );
}
