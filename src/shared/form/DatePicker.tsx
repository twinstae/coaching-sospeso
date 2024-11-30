import clsx from "clsx";
import { useId, useMemo, type ComponentProps } from "react";
import { useController, useFormContext } from "react-hook-form";
import { SimpleErrorMessage } from "./SimpleErrorMessage";

export function DatePicker<InputT extends Record<string, any>>({
  label,
  name,
  className,
  ...props
}: { label: string; name: keyof InputT & string } & Omit<
  ComponentProps<"input">,
  "onChange" | "onBlur" | "value" | "type"
>) {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: true },
  });
  const errorId = useId();
  const isInvalid = error?.message !== undefined;

  const value = useMemo(() => {
    if (field.value) {
      return field.value.toISOString().slice(0, 10);
    }
    return "";
  }, [field.value]);

  return (
    <div>
      <label className="form-control">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          {...props}
          role="textbox"
          type="date"
          name={field.name} // send down the input name
          className={clsx(
            "input input-bordered aria-[invalid=true]:input-error w-full",
            className,
          )}
          onChange={(event) => {
            if (event.target.value) {
              field.onChange(new Date(event.target.value + "T00:00:00Z"));
            } else {
              field.onChange(null);
            }
          }} // send value to hook form
          onBlur={field.onBlur} // notify when input is touched/blur
          value={value} // input value
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
