import {
  Select,
  SelectItem,
  SelectLabel,
  SelectPopover,
  SelectProvider,
  SelectValue,
} from "@ariakit/react/select";
import { useCallback, useId } from "react";
import { useController, useFormContext } from "react-hook-form";
import { SimpleErrorMessage } from "./SimpleErrorMessage";

export default function SimpleSelect({
  optionList,
  name,
  label,
  placeholder,
}: {
  optionList: {
    value: string;
    label: string;
  }[];
  name: string;
  label: string;
  placeholder: string;
}) {
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

  const renderValue = useCallback(
    (value: string) => {
      const result = optionList.filter((option) => {
        return option.value === value;
      });

      const option = result[0];

      return option?.label;
    },
    [optionList],
  );

  return (
    <div>
      <SelectProvider
        defaultValue=""
        setValue={field.onChange} // send value to hook form
        value={field.value ?? ""} // input value
      >
        <SelectLabel className="label label-text">{label}</SelectLabel>
        <Select
          className="select select-bordered aria-[invalid=true]:select-error w-full"
          name={field.name} // send down the input name
          onBlur={field.onBlur} // notify when input is touched/blur
          ref={field.ref} // send input ref, so we can focus on input when error appear
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? errorId : undefined}
          aria-errormessage={isInvalid ? errorId : undefined}
        >
          <SelectValue fallback={placeholder}>{renderValue}</SelectValue>
        </Select>
        <SelectPopover gutter={4} sameWidth className="popover">
          {optionList.map(({ value, label }) => (
            <SelectItem key={value} className="select-item" value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectPopover>
        <SimpleErrorMessage id={errorId} error={error} />
      </SelectProvider>
    </div>
  );
}
