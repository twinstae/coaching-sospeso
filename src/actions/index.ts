import {
  createFakeRepository,
  type SospesoRepositoryI,
} from "@/sospeso/repository.ts";
import * as domain from "@/sospeso/domain.ts";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import invariant from "@/invariant.ts";
import { SOSPESO_PRICE } from "@/sospeso/constants";
import { readInbox } from "@/adapters/emailApi";

export function createActionServer(sospesoRepo: SospesoRepositoryI) {
  return {
    retrieveSospesoList: defineAction({
      input: z.object({}),
      handler: async (_input) => {
        return sospesoRepo.retrieveSospesoList();
      },
    }),
    retrieveSospesoDetail: defineAction({
      input: z.object({ sospesoId: z.string().uuid() }),
      handler: async (input) => {
        return sospesoRepo.retrieveSospesoDetail(input.sospesoId);
      },
    }),
    retrieveSospesoApplicationList: defineAction({
      input: z.object({}),
      handler: async (_input) => {
        return sospesoRepo.retrieveApplicationList();
      },
    }),
    readInbox: defineAction({
      input: z.object({
        email: z.string().email(),
      }),
      handler: async (input) => {
        return readInbox(input.email);
      },
    }),
    issueSospeso: defineAction({
      input: z.object({
        sospesoId: z.string(),
        issuedAt: z.coerce.date(),
        issuerId: z.string(),
        from: z.string(),
        to: z.string(),
      }),
      handler: async (input) => {
        await sospesoRepo.updateOrSave(input.sospesoId, (existed) => {
          invariant(existed === undefined, "이미 소스페소가 생성되었어요!");

          const issuedSospeso = domain.issueSospeso({
            ...input,
            paidAmount: SOSPESO_PRICE,
          });

          return issuedSospeso;
        });
      },
    }),
    applySospeso: defineAction({
      input: z.object({
        sospesoId: z.string(),
        appliedAt: z.coerce.date(),
        applicationId: z.string(),
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
    consumeSospeso: defineAction({
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
  };
}

export const server = createActionServer(createFakeRepository());
