import {
  createFakeSospesoRepository,
  type SospesoRepositoryI,
} from "@/sospeso/repository.ts";
import * as domain from "@/sospeso/domain.ts";
import { z } from "astro:schema";
import invariant from "@/invariant.ts";
import { SOSPESO_PRICE } from "@/sospeso/constants";
import { readInbox } from "@/adapters/emailApi";
import {
  buildActionServer,
  definePureAction,
  type ActionDefinition,
} from "./buildActionServer";
import {
  createFakePaymentRepository,
  type PaymentRepositoryI,
} from "@/payment/repository";
import { createSospesoIssuingPayment } from "@/payment/domain";
import {
  fakePayplePaymentApi,
  payplePaymentApi,
} from "@/adapters/payplePaymentApi";
import { isProd } from "@/adapters/env";
import { isAdmin } from "@/auth/domain";
import { createDrizzleSospesoRepository } from "@/adapters/drizzle/drizzleSospesoRepository";
import { db } from "@/adapters/db";
import { createDrizzlePaymentRepository } from "@/adapters/drizzle/drizzlePaypmentRepository";

export const paymentApi = isProd ? payplePaymentApi : fakePayplePaymentApi;

export function buildSospesoActions(
  sospesoRepo: SospesoRepositoryI,
  paymentRepo: PaymentRepositoryI,
) {
  return {
    approveSospesoApplication: definePureAction({
      input: z.object({
        sospesoId: z.string(),
        applicationId: z.string(),
      }),
      handler: async (input, { locals: { user } }) => {
        invariant(user, "로그인을 해야 합니다");
        invariant(isAdmin(user), "관리자가 아닙니다!");

        return sospesoRepo.updateOrSave(input.sospesoId, (sospeso) => {
          invariant(sospeso !== undefined, "존재하지 않는 소스페소입니다!");

          const approvedSospeso = domain.approveApplication(sospeso, input);
          return approvedSospeso;
        });
      },
    }),
    rejectSospesoApplication: definePureAction({
      input: z.object({
        sospesoId: z.string(),
        applicationId: z.string(),
      }),
      handler: async (input, { locals: { user } }) => {
        invariant(user, "로그인을 해야 합니다");
        invariant(isAdmin(user), "관리자가 아닙니다!");

        return sospesoRepo.updateOrSave(input.sospesoId, (sospeso) => {
          invariant(sospeso !== undefined, "존재하지 않는 소스페소입니다!");

          const rejectedSospeso = domain.rejectApplication(sospeso, input);
          return rejectedSospeso;
        });
      },
    }),
    readInbox: definePureAction({
      input: z.object({
        email: z.string().email(),
      }),
      handler: async (input) => {
        return readInbox(input.email);
      },
    }),
    createIssuingSospesoPayment: definePureAction({
      input: z.object({
        sospesoId: z.string(),
        from: z.string(),
        to: z.string(),
      }),
      handler: async (input, { locals: { user, now } }) => {
        const issuerId = user?.id;

        invariant(issuerId, "로그인해야 소스페소를 발급할 수 있어요!");

        await paymentRepo.updateOrSave(input.sospesoId, (payment) => {
          invariant(payment === undefined, "이미 결제가 진행 중이에요!");

          return createSospesoIssuingPayment({
            sospesoId: input.sospesoId,
            now,
            totalAmount: SOSPESO_PRICE,
            command: {
              sospesoId: input.sospesoId,
              issuedAt: now,
              from: input.from,
              to: input.to,
              issuerId,
              paidAmount: SOSPESO_PRICE,
            },
          });
        });
      },
    }),
    applySospeso: definePureAction({
      input: z.object({
        sospesoId: z.string(),
        applicationId: z.string(),
        appliedAt: z.coerce.date(),
        content: z.string(),
      }),
      handler: async (input, { locals: { user } }) => {
        invariant(user, "로그인을 해야 합니다");
        const applicantId = user.id;

        invariant(applicantId, "로그인해야 소스페소를 발급할 수 있어요!");

        await sospesoRepo.updateOrSave(input.sospesoId, (sospeso) => {
          invariant(sospeso !== undefined, "존재하지 않는 소스페소입니다!");

          const appliedSospeso = domain.applySospeso(sospeso, {
            ...input,
            applicantId,
          });

          return appliedSospeso;
        });
      },
    }),
    consumeSospeso: definePureAction({
      input: z.object({
        sospesoId: z.string(),
        consumerId: z.string(),
        coachId: z.string(),
        consumingId: z.string(),
        consumedAt: z.coerce.date(),
        content: z.string(),
        memo: z.string(),
      }),
      handler: async (input, { locals: { user } }) => {
        invariant(user, "로그인을 해야 합니다");

        await sospesoRepo.updateOrSave(input.sospesoId, (sospeso) => {
          invariant(sospeso !== undefined, "존재하지 않는 소스페소입니다!");

          const appliedSospeso = domain.consumeSospeso(sospeso, { ...input });

          return appliedSospeso;
        });
      },
    }),
  } satisfies Record<string, ActionDefinition>;
}

export const sospesoRepo = createDrizzleSospesoRepository(db);
export const paymentRepo = createDrizzlePaymentRepository(db);

export const server = buildActionServer(
  buildSospesoActions(sospesoRepo, paymentRepo),
);
