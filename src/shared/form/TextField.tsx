import clsx from "clsx";
import { useId, type ComponentProps } from "react";
import { useController, useFormContext } from "react-hook-form";
import { SimpleErrorMessage } from "./SimpleErrorMessage";

export function TextField<InputT extends Record<string, any>>({
  label,
  name,
  className,
  ...props
}: { label: string; name: keyof InputT & string } & Omit<
  ComponentProps<"input">,
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
  const errorId = useId();

  return (
    <div>
      <label className="input input-bordered flex items-center gap-2">
        {label}
        <input
          type="text"
          {...props}
          name={field.name} // send down the input name
          className={clsx("grow", className)}
          onChange={field.onChange} // send value to hook form
          onBlur={field.onBlur} // notify when input is touched/blur
          value={field.value ?? ""} // input value
          ref={field.ref} // send input ref, so we can focus on input when error appear
          aria-describedby={error?.message && errorId}
          aria-errormessage={error?.message && errorId}
        />
      </label>
      <SimpleErrorMessage id={errorId} error={error} />
    </div>
  );
}
