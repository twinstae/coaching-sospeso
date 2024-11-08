import { useState } from "react";
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
  const [errors, setErrors] = useState<{ from?: string; to?: string }>({});
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const result = v.safeParse(issuingSchema, Object.fromEntries(formData));
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
        From.
        <input
          type="text"
          name="from"
          className="grow"
          placeholder="ex) 탐정토끼, 김태희"
        />
      </label>
      {errors.from && (
        <p role="alert" aria-label={errors.from}>
          {errors.from}
        </p>
      )}
      <label className="input input-bordered flex items-center gap-2">
        To.
        <input
          type="text"
          name="to"
          className="grow"
          placeholder="ex) 퀴어 문화 축제 올 사람"
        />
      </label>
      {errors.to && (
        <p role="alert" aria-label={errors.to}>
          {errors.to}
        </p>
      )}
      <button className="btn btn-primary" type="submit">
        발행하기
      </button>
    </form>
  );
}