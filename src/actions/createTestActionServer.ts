import {
  ActionError,
  ActionInputError,
  type ActionAPIContext,
} from "astro:actions";
import type { z } from "astro/zod";
import type { Sospeso } from "@/sospeso/domain";
import { buildSospesoActions } from "./index.ts";
import type { SospesoRepositoryI } from "@/sospeso/repository.ts";
import type { ActionDefinition } from "./buildActionServer.ts";
import {
  createFakePaymentRepository,
  type PaymentRepositoryI,
} from "@/payment/repository.ts";

type ActionTestClient<TOutput, TInputSchema extends z.ZodType> = (
  input: z.input<TInputSchema>,
  context?: ActionAPIContext,
) => Promise<Awaited<TOutput>>;

type InferDefinedTestActions<T> = {
  [K in keyof T]: T[K] extends ActionDefinition<infer Input, infer Output>
    ? ActionTestClient<Output, z.ZodType<Input>> & string
    : never;
};

type TestActionServer = InferDefinedTestActions<
  ReturnType<typeof buildSospesoActions>
>;

function defineTestAction<TInput, TOutput>({
  input,
  handler,
}: ActionDefinition<TInput, TOutput>) {
  return async (unparsedInput: unknown, context: unknown) => {
    if (unparsedInput instanceof FormData) {
      throw new ActionError({
        code: "UNSUPPORTED_MEDIA_TYPE",
        message: "This action only accepts JSON.",
      });
    }

    const parsed = await input.safeParseAsync(
      JSON.parse(JSON.stringify(unparsedInput)),
    );
    if (!parsed.success) {
      throw new ActionInputError(parsed.error.issues);
    }

    return await handler(parsed.data, context as ActionAPIContext);
  };
}

export async function buildTestActionServer(
  createSospesoRepository: (
    initState: Record<string, Sospeso>,
  ) => Promise<SospesoRepositoryI>,
  initState: Record<string, Sospeso>,
): Promise<{
  actionServer: TestActionServer;
  sospesoRepo: SospesoRepositoryI;
  paymentRepo: PaymentRepositoryI;
}> {
  const sospesoRepo = await createSospesoRepository(initState);
  const paymentRepo = createFakePaymentRepository({});
  const pureActions = buildSospesoActions(sospesoRepo, paymentRepo);

  return {
    actionServer: Object.fromEntries(
      Object.entries(pureActions).map(([key, actionDefinition]) => [
        key,
        defineTestAction(actionDefinition as any) as any,
      ]),
    ) as TestActionServer,
    sospesoRepo,
    paymentRepo,
  };
}
