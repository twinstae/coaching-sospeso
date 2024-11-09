import { UUIDGeneratorApi, type IdGeneratorApi } from '@/adapters/IdGeneratorApi';
import { createSafeEvent } from '@/event/SafeEventBus';
import { Form } from "@/shared/form/Form";
import { TextField } from "@/shared/form/TextField";
import { useMemo } from 'react';
import * as v from "valibot";

const issuingSchema = v.object({
  sospesoId: v.string(),
  from: v.pipe(v.string(), v.minLength(1, "From. 을 입력해주세요")),
  to: v.string(),
});

export const sospesoIssuingEventBus = createSafeEvent("sospeso-issuing", issuingSchema)

export function SospesoIssuingForm({ idGeneratorApi = UUIDGeneratorApi }: { idGeneratorApi?: IdGeneratorApi }) {
  const id = useMemo(() => idGeneratorApi.generateId(), [idGeneratorApi])

  return (
    <Form
      form={{
        schema: issuingSchema,
        defaultValues: { sospesoId: id, from: "", to: "" },
        bus: sospesoIssuingEventBus
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
