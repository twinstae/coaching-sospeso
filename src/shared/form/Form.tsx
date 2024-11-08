import type { ComponentProps } from "react";
import { FormProvider, useForm, type DefaultValues } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { BaseIssue, BaseSchema, ObjectSchema, InferOutput } from "valibot";

export function Form<
  SchemaT extends ObjectSchema<
    {
      [key: string]: BaseSchema<unknown, unknown, BaseIssue<unknown>>;
    },
    undefined
  >,
  InputT extends Record<string, any> = InferOutput<SchemaT>,
>({
  form,
  ...props
}: {
  form: {
    schema: SchemaT;
    defaultValues: DefaultValues<InputT>;
    onSubmit: (input: InputT) => Promise<void>;
  };
} & Omit<ComponentProps<"form">, "onSubmit">) {
  const methods = useForm({
    defaultValues: form.defaultValues,
    resolver: valibotResolver(form.schema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(form.onSubmit)} {...props} />
    </FormProvider>
  );
}
