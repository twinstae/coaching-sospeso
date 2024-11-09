import type { ComponentProps } from "react";
import { FormProvider, useForm, type DefaultValues } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { BaseIssue, BaseSchema, ObjectSchema, InferOutput } from "valibot";
import type { SafeEventBus } from "@/event/SafeEventBus";
import type React from "react";

export function Form<
  SchemaT extends ObjectSchema<
    {
      [key: string]: BaseSchema<unknown, unknown, BaseIssue<unknown>>;
    },
    undefined
  >,
  InputT extends InferOutput<SchemaT>,
>({
  form,
  ...props
}: {
  form: {
    schema: SchemaT;
    defaultValues: DefaultValues<InputT>;
    bus?: SafeEventBus<InputT>;
    onSubmit?: (
      data: InputT,
      event?: React.BaseSyntheticEvent,
    ) => Promise<void> | void;
  };
} & Omit<ComponentProps<"form">, "onSubmit">) {
  const methods = useForm({
    defaultValues: form.defaultValues,
    resolver: valibotResolver(form.schema),
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data, event) => {
          form.bus?.dispatch(event?.target, data);
          form.onSubmit?.(data, event);
        })}
        {...props}
      />
    </FormProvider>
  );
}
