import { useState } from "react";
import * as v from "valibot";

const consumingSchema = v.object({
  coachId: v.pipe(v.string(), v.minLength(1, "코치를 선택해주세요")),
  consumedAt: v.pipe(
    v.string(),
    v.minLength(1, "코칭 일시를 입력해주세요"),
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
  const [errors, setErrors] = useState<{
    coachId?: string;
    consumedAt?: string;
    content?: string;
    memo?: string;
  }>({});
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const result = v.safeParse(
          consumingSchema,
          Object.fromEntries(formData),
        );
        if (result.success) {
          onSubmit(result.output);
        } else {
          setErrors(
            Object.fromEntries(
              result.issues.map(
                (issue) => [issue.path?.[0].key, issue.message] as const,
              ),
            ),
          );
        }
      }}
    >
      <label className="input input-bordered flex items-center gap-2">
        코치
        <input
          type="text"
          name="coachId"
          className="grow"
          placeholder="ex) 탐정토끼, 김태희"
        />
      </label>
      {errors.coachId && (
        <p role="alert" aria-label={errors.coachId}>
          {errors.coachId}
        </p>
      )}

      <label className="input input-bordered flex items-center gap-2">
        코칭일시
        <input
          type="datetime"
          name="consumedAt"
          className="grow"
          placeholder="2024-01-01"
        />
      </label>
      {errors.consumedAt && (
        <p role="alert" aria-label={errors.consumedAt}>
          {errors.consumedAt}
        </p>
      )}

      <label className="textarea textarea-bordered flex items-center gap-2">
        후기
        <textarea name="content" className="grow" placeholder="" />
      </label>
      {errors.content && (
        <p role="alert" aria-label={errors.content}>
          {errors.content}
        </p>
      )}

      <label className="textarea textarea-bordered flex items-center gap-2">
        메모
        <textarea name="memo" className="grow" placeholder="" />
      </label>
      {errors.memo && (
        <p role="alert" aria-label={errors.memo}>
          {errors.memo}
        </p>
      )}

      <button className="btn btn-primary" type="submit">
        소스페소 사용하기
      </button>
    </form>
  );
}
