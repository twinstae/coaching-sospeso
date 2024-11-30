import { generateNanoId, type generateIdI } from "@/adapters/generateId";
import { createSafeEvent } from "@/event/SafeEventBus";
import { DatePicker } from "@/shared/form/DatePicker";
import { Form } from "@/shared/form/Form.tsx";
import SimpleSelect from "@/shared/form/Select";
import { Textarea } from "@/shared/form/Textarea.tsx";
import { useId, useMemo } from "react";
import * as v from "valibot";

const consumingSchema = v.object({
  coachId: v.string("코치를 선택해주세요"),
  consumingId: v.string(),
  consumedAt: v.date("코칭 일시를 입력해주세요"),
  content: v.pipe(v.string(), v.minLength(1, "후기를 입력해주세요")),
  memo: v.pipe(v.string(), v.minLength(1, "메모를 입력해주세요")),
});

export const sospesoConsumingEventBus = createSafeEvent(
  "sospeso-consume",
  consumingSchema,
);

export function SospesoConsumingForm({
  today = new Date(),
  generateId = generateNanoId,
  coachList,
}: {
  today?: Date;
  generateId?: generateIdI;
  coachList: {
    id: string;
    name: string;
  }[];
}) {
  const consumingId = useMemo(() => generateId(), []);

  const formTitleId = useId();

  return (
    <Form
      className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-4"
      aria-labelledby={formTitleId}
      form={{
        schema: consumingSchema,
        bus: sospesoConsumingEventBus,
        defaultValues: {
          consumingId,
          content: "",
          consumedAt: today,
          memo: "",
        },
      }}
    >
      <h1 id={formTitleId} className="text-page-title">
        소스페소 사용하기 (코칭 완료)
      </h1>

      <SimpleSelect
        optionList={coachList.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        label="코치"
        name="coachId"
        placeholder={"선택하기"}
      />

      <DatePicker
        label="코칭일시"
        name="consumedAt"
        placeholder="2024-01-01"
        min="2024-01-10"
        max={today.toISOString().slice(0, 10)}
      />

      <Textarea label="후기" name="content" placeholder="" />

      <Textarea label="메모" name="memo" placeholder="" />

      <button className="btn btn-primary" type="submit">
        소스페소 사용하기
      </button>
    </Form>
  );
}
