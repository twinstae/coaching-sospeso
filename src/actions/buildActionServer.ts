import {
  defineAction,
  type ActionClient,
  type ActionHandler,
} from "astro:actions";

import { z } from "astro:schema";
export type ActionDefinition<TInput = any, TOutput = any> = {
  input: z.ZodType<TInput>;
  handler: ActionHandler<TInput, TOutput>;
};

type InferDefinedActions<T> = {
  [K in keyof T]: T[K] extends ActionDefinition<infer Input, infer Output>
  ? ActionClient<Output, undefined, z.ZodType<Input>> & string
  : never;
};

export function definePureAction<
  TOutput,
  TInputSchema extends z.ZodType,
>(actionDefinition: {
  input: TInputSchema;
  handler: ActionHandler<TInputSchema, TOutput>;
}): ActionDefinition<z.output<TInputSchema>, TOutput> {
  return actionDefinition;
}

export function buildActionServer<T extends Record<string, ActionDefinition>>(
  pureActions: T,
): InferDefinedActions<T> {
  return Object.fromEntries(
    Object.entries(pureActions).map(([key, actionDefinition]) => [
      key,
      defineAction(actionDefinition),
    ]),
  ) as InferDefinedActions<T>;
}
