import clsx from "clsx";
import { useId, type ComponentProps } from "react";
import { useController, useFormContext } from "react-hook-form";
import { SimpleErrorMessage } from "./SimpleErrorMessage";

export function TextField<InputT extends Record<string, any>>({
  label,
  name,
  type = "text",
  className,
  maxLength,
  ...props
}: {
  label: string;
  name: keyof InputT & string;
  type?: "text" | "email" | "password" | "tel";
  maxLength: number;
} & Omit<ComponentProps<"input">, "onChange" | "onBlur" | "value" | "maxLength">) {
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

  return (
    <div>
      <label className="flex flex-col items-start">
        {label}
        <input
          {...props}
          type={type}
          role="textbox"
          name={field.name} // send down the input name
          className={clsx(
            "input input-bordered aria-[invalid=true]:input-error w-full",
            className,
          )}
          onChange={field.onChange} // send value to hook form
          onBlur={field.onBlur} // notify when input is touched/blur
          value={field.value ?? ""} // input value
          maxLength={maxLength}
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
