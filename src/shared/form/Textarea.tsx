import clsx from "clsx";
import type { ComponentProps } from "react";
import { useController, useFormContext } from "react-hook-form";

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
      // invalid, isTouched, isDirty,
    },
    // formState: {
    //     touchedFields, dirtyFields
    // }
  } = useController({
    name,
    control,
    rules: { required: true },
  });

  return (
    <div>
      <label className="textarea textarea-bordered flex items-center gap-2">
        {label}
        <textarea
          {...props}
          name={field.name} // send down the input name
          className={clsx("grow", className)}
          onChange={field.onChange} // send value to hook form
          onBlur={field.onBlur} // notify when input is touched/blur
          value={field.value ?? ""} // input value
          ref={field.ref} // send input ref, so we can focus on input when error appear
        />
      </label>
      {error && (
        <p role="alert" aria-label={error.message}>
          {error.message}
        </p>
      )}
    </div>
  );
}
