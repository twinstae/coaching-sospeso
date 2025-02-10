import type { z } from "astro/zod";
import type { Sospeso } from "@/sospeso/domain";
import { buildSospesoActions, type ActionContext } from "./actions.ts";
import type { SospesoRepositoryI } from "@/sospeso/repository.ts";
import type { ActionDefinition } from "./buildActionServer.ts";
import { type PaymentRepositoryI } from "@/payment/repository.ts";
import type { Payment } from "@/payment/domain.ts";
import type { Account } from "@/accounting/domain.ts";
import type { AccountRepositoryI } from "@/accounting/repository.ts";

type ActionTestClient<TOutput, TInputSchema extends z.ZodType> = (
  input: z.input<TInputSchema>,
  context?: ActionContext,
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
      throw new Error("This action only accepts JSON.");
    }

    const parsed = await input.safeParseAsync(
      JSON.parse(JSON.stringify(unparsedInput)),
    );
    if (!parsed.success) {
      throw new Error(
        parsed.error.issues.map((issue) => issue.message).join("\n"),
      );
    }

    return await handler(parsed.data, context as any);
  };
}

export async function buildTestActionServer({
  sospeso,
  payment,
  account
}: {
  sospeso: {
    createSospesoRepository: (
      initState: Record<string, Sospeso>,
    ) => Promise<SospesoRepositoryI>;
    initState: Record<string, Sospeso>;
  };
  payment: {
    createPaymentRepository: (
      initState: Record<string, Payment>,
    ) => Promise<PaymentRepositoryI>;
    initState: Record<string, Payment>;
  };
  account: {
    createAccountRepository: (
      initState: Record<string, Account>,
    ) => Promise<AccountRepositoryI>;
    initState: Record<string, Account>;
  };
}): Promise<{
  actionServer: TestActionServer;
  sospesoRepo: SospesoRepositoryI;
  paymentRepo: PaymentRepositoryI;
  accountRepo: AccountRepositoryI;
}> {
  const sospesoRepo = await sospeso.createSospesoRepository(sospeso.initState);
  const paymentRepo = await payment.createPaymentRepository(payment.initState);
  const accountRepo = await account.createAccountRepository(account.initState);
  const pureActions = buildSospesoActions(sospesoRepo, paymentRepo, accountRepo);

  return {
    actionServer: Object.fromEntries(
      Object.entries(pureActions).map(([key, actionDefinition]) => [
        key,
        defineTestAction(actionDefinition as any) as any,
      ]),
    ) as TestActionServer,
    sospesoRepo,
    paymentRepo,
    accountRepo,
  };
}
