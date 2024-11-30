import clsx from "clsx";
import { useId, type ComponentProps } from "react";
import { useController, useFormContext } from "react-hook-form";
import { SimpleErrorMessage } from "./SimpleErrorMessage";

export function Textarea<InputT extends Record<string, any>>({
  label,
  name,
  className,
  ...props
}: { label: string; name: keyof InputT & string } & Omit<
  ComponentProps<"textarea">,
  "onChange" | "onBlur" | "value"
>) {
  const { control } = useFormContext();
  const {
    field,
    fieldState: {
      error,
      // isTouched, isDirty,
    },
    // formState: {
    //     touchedFields, dirtyFields
    // }
  } = useController({
    name,
    control,
    rules: { required: true },
  });

  const errorId = useId();
  const isInvalid = error?.message !== undefined;

  return (
    <div className="w-full">
      <label className="form-control">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <textarea
          {...props}
          name={field.name} // send down the input name
          className={clsx(
            "textarea textarea-bordered aria-[invalid=true]:textarea-error w-full",
            className,
          )}
          onChange={field.onChange} // send value to hook form
          onBlur={field.onBlur} // notify when input is touched/blur
          value={field.value ?? ""} // input value
          ref={field.ref} // send input ref, so we can focus on input when error appear
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? errorId : undefined}
          aria-errormessage={isInvalid ? errorId : undefined}
        />
      </label>
      <SimpleErrorMessage id={errorId} error={error} />
    </div>
  );
}
