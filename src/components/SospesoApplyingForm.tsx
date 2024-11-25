import { generateNanoId, type generateIdI } from "@/adapters/generateId";
import { createSafeEvent } from "@/event/SafeEventBus";
import { Form } from "@/shared/form/Form";
import { Textarea } from "@/shared/form/Textarea";
import { useMemo } from "react";
import * as v from "valibot";
import { Checkbox } from "@/shared/form/Checkbox.tsx";
import { Link } from "@/routing/Link";

const applyingSchema = v.pipe(
  v.object({
    applicationId: v.string(),
    content: v.pipe(
      v.string(),
      v.minLength(1, "코치에게 쓸 편지를 입력해주세요"),
    ),
    usage: v.boolean(),
  }),
  v.forward(
    v.partialCheck(
      [["usage"]],
      (input) => input.usage === true,
      "이용약관에 동의하지 않으면 신청할 수 없습니다",
    ),
    ["usage"],
  ),
);

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

  

  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-4">
      <h2 className="text-2xl font-semibold">
        소스페소 신청하기
      </h2>
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
        <Checkbox
            label={
              <>
                <Link
                  className="link link-primary hover:bg-base-200 rounded cursor-pointer transition-colors h-full py-1 px-2 -mx-1"
                  routeKey={"이용약관"}
                  params={undefined}
                  target="_blank"
                >
                  이용약관 <span className="text-red-600">(필수)</span>
                </Link>
              </>
            }
            name="usage"
          />
        <button className="btn btn-primary w-full" type="submit">
          신청하기
        </button>
      </Form>
    </div>
  );
}
