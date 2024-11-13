import { generateNanoId, type generateIdI } from "@/adapters/generateId";
import { createSafeEvent } from "@/event/SafeEventBus";
import { Form } from "@/shared/form/Form";
import { Textarea } from "@/shared/form/Textarea";
import { useMemo } from "react";
import * as v from "valibot";

const applyingSchema = v.object({
  applicationId: v.string(),
  content: v.pipe(
    v.string(),
    v.minLength(1, "코치에게 쓸 편지를 입력해주세요"),
  ),
});

export const sospesoApplyingEventBus = createSafeEvent(
  "sospeso-applying",
  applyingSchema,
);

export function SospesoApplyingForm({
  generateId = generateNanoId,
}: {
  generateId?: generateIdI;
}) {
  const id = useMemo(() => generateId(), [generateId]);

  return (
    <Form
      form={{
        schema: applyingSchema,
        defaultValues: { applicationId: id, content: "" },
        bus: sospesoApplyingEventBus,
      }}
    >
      <Textarea label="코치에게 쓰는 편지" name="content" />
      <button className="btn btn-primary" type="submit">
        신청하기
      </button>
    </Form>
  );
}
