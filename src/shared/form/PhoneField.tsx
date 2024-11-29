import clsx from "clsx";
import { useId, type ComponentProps } from "react";
import { useController, useFormContext } from "react-hook-form";
import { SimpleErrorMessage } from "./SimpleErrorMessage";
import { formatPhoneNumber } from './phone';

export function PhoneField<InputT extends Record<string, any>>({
  label,
  name,
  className,
  ...props
}: {
  label: string;
  name: keyof InputT & string;
} & Omit<ComponentProps<"input">, "onChange" | "onBlur" | "value" | "maxLength" | "type">) {
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
          type="tel"
          role="textbox"
          name={field.name} // send down the input name
          className={clsx(
            "input input-bordered aria-[invalid=true]:input-error w-full",
            className,
          )}
          onChange={event => {
            field.onChange(formatPhoneNumber(event.target.value))
          }}
          onBlur={field.onBlur} // notify when input is touched/blur
          value={formatPhoneNumber(field.value  ?? "")} // input value
          maxLength={13}
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
