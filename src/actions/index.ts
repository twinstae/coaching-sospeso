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

export function buildSospesoActions(
  sospesoRepo: SospesoRepositoryI,
  paymentRepo: PaymentRepositoryI,
) {
  return {
    retrieveSospesoList: definePureAction({
      input: z.object({}),
      handler: async (_input) => {
        return sospesoRepo.retrieveSospesoList();
      },
    }),
    retrieveSospesoDetail: definePureAction({
      input: z.object({ sospesoId: z.string() }),
      handler: async (input) => {
        return sospesoRepo.retrieveSospesoDetail(input.sospesoId);
      },
    }),
    retrieveSospesoApplicationList: definePureAction({
      input: z.object({}),
      handler: async (_input) => {
        return sospesoRepo.retrieveApplicationList();
      },
    }),
    approveSospesoApplication: definePureAction({
      input: z.object({
        sospesoId: z.string(),
        applicationId: z.string(),
      }),
      handler: async (input) => {
        // TODO! 승인 권한 체크

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
      handler: async (input) => {
        // TODO! 거절 권한 체크

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
    issueSospeso: definePureAction({
      input: z.object({
        sospesoId: z.string(),
        issuedAt: z.coerce.date(),
        from: z.string(),
        to: z.string(),
      }),
      handler: async (input, { locals: { session, now } }) => {
        const issuerId = session?.id;

        invariant(issuerId, "로그인해야 소스페소를 발급할 수 있어요!");

        await paymentRepo.updateOrSave(input.sospesoId, (payment) => {
          invariant(payment === undefined, "이미 결제가 진행 중이에요!");

          return createSospesoIssuingPayment({
            sospesoId: input.sospesoId,
            now,
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
      handler: async (input, context) => {
        const applicantId = context.locals.session?.id;

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
      handler: async (input) => {
        await sospesoRepo.updateOrSave(input.sospesoId, (sospeso) => {
          invariant(sospeso !== undefined, "존재하지 않는 소스페소입니다!");

          const appliedSospeso = domain.consumeSospeso(sospeso, { ...input });

          return appliedSospeso;
        });
      },
    }),
  } satisfies Record<string, ActionDefinition>;
}

export const server = buildActionServer(
  buildSospesoActions(
    createFakeSospesoRepository({}),
    createFakePaymentRepository({}),
  ),
);
