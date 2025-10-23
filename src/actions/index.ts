import { defineAction, type ActionClient } from "astro:actions";
import { accountRepo, buildSospesoActions, paymentRepo, sospesoRepo } from "./actions";
import type { ActionDefinition } from "./buildActionServer";
import type * as z from "astro/zod";
import type { Prettify } from 'better-auth';

type InferDefinedActions<T> = Prettify<{
  [K in keyof T]: T[K] extends ActionDefinition<infer Input, infer Output>
    ? ActionClient<Output, undefined, z.ZodType<Input, z.ZodTypeDef, any>> & string
    : never;
}>;

export function buildActionServer<T extends Record<string, ActionDefinition>>(
  pureActions: T,
): InferDefinedActions<T> {
  return Object.fromEntries(
    Object.entries(pureActions).map(([key, actionDefinition]) => [
      key,
      defineAction(actionDefinition as any),
    ]),
  ) as InferDefinedActions<T>;
}

export const server = buildActionServer(
  buildSospesoActions(sospesoRepo, paymentRepo, accountRepo),
);
