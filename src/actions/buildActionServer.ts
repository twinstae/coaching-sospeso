import type * as z from "zod";
import type { ActionContext } from "./actions";

export type ActionHandler<TInputSchema, TOutput> =
  TInputSchema extends z.ZodType
    ? (input: z.infer<TInputSchema>, context: ActionContext) => Promise<TOutput>
    : (input: any, context: ActionContext) => Promise<TOutput>;

export type ActionDefinition<TInput = any, TOutput = any> = {
  input: z.ZodType<TInput>;
  handler: ActionHandler<TInput, TOutput>;
};

export function definePureAction<
  TInputSchema extends z.ZodType,
  TOutput,
>(actionDefinition: {
  input: TInputSchema;
  handler: ActionHandler<TInputSchema, TOutput>;
}): ActionDefinition<z.output<TInputSchema>, TOutput> {
  return actionDefinition;
}
