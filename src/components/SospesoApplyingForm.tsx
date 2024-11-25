import { generateNanoId, type generateIdI } from "@/adapters/generateId";
import { createSafeEvent } from "@/event/SafeEventBus";
import { Form } from "@/shared/form/Form";
import { Textarea } from "@/shared/form/Textarea";
import { useMemo, useState } from "react";
import * as v from "valibot";
import type { ChangeEvent } from "react";
import { Link } from "@/routing/Link.tsx";

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
  sospeso,
  generateId = generateNanoId,
}: {
  sospeso:
  | {
    id: string;
    from: string;
    to: string;
    status: "issued" | "pending";
    consuming: undefined;
  }
| {
    id: string;
    from: string;
    to: string;
    status: "consumed";
    consuming: {
      consumer: { id: string; nickname: string };
      content: string;
    };
  };
  generateId?: generateIdI;
}) {
  const id = useMemo(() => generateId(), [generateId]);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  }

  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-4">
      <p>From. {sospeso.from}</p>
      <p>To. {sospeso.to}</p>
      <Form
        form={{
          schema: applyingSchema,
          defaultValues: { applicationId: id, content: "" },
          bus: sospesoApplyingEventBus,
        }}
      >
        <Textarea label="코치에게 쓰는 편지" name="content" />
        
          <label className="label cursor-pointer">
            <span className="label-text">코칭 약관에 동의하기</span>
            <input type="checkbox" className="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
          </label>

          <Link routeKey="이용약관" params={undefined}>
            코칭 약관 자세히 보기
          </Link>
        
        <button className="btn btn-primary w-full" type="submit" disabled={!isChecked}>
          신청하기
        </button>
      </Form>
    </div>
  );
}
