import {
  createFakeRepository,
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

export function buildSospesoActions(sospesoRepo: SospesoRepositoryI) {
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
      handler: async (input, context) => {
        const issuerId = context.locals.session?.id;

        invariant(issuerId, "로그인해야 소스페소를 발급할 수 있어요!");

        await sospesoRepo.updateOrSave(input.sospesoId, (existed) => {
          invariant(existed === undefined, "이미 소스페소가 생성되었어요!");

          const issuedSospeso = domain.issueSospeso({
            ...input,
            issuerId,
            paidAmount: SOSPESO_PRICE,
          });

          return issuedSospeso;
        });
      },
    }),
    applySospeso: definePureAction({
      input: z.object({
        sospesoId: z.string(),
        applicationId: z.string(),
        appliedAt: z.coerce.date(),
        applicantId: z.string(),
        content: z.string(),
      }),
      handler: async (input) => {
        await sospesoRepo.updateOrSave(input.sospesoId, (sospeso) => {
          invariant(sospeso !== undefined, "존재하지 않는 소스페소입니다!");

          const appliedSospeso = domain.applySospeso(sospeso, input);

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
  buildSospesoActions(createFakeRepository({})),
);
