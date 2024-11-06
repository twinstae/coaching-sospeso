import {
  createFakeRepository,
  type SospesoRepositoryI,
} from "@/sospeso/repository.ts";
import * as domain from "@/sospeso/domain.ts";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import invariant from "@/invariant.ts";
import { TEST_APPLICATION_LIST } from '@/sospeso/fixtures.ts';

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
        return TEST_APPLICATION_LIST
      },
    }),
    issueSospeso: defineAction({
      input: z.object({
        sospesoId: z.string(),
        from: z.string(),
        to: z.string(),
      }),
      handler: async (input) => {
        const issuedSospeso = domain.issueSospeso({
          ...input,
          issuedAt: new Date(),
        });

        await sospesoRepo.updateOrSave(input.sospesoId, (existed) => {
          invariant(existed === undefined, "이미 소스페소가 생성되었어요!");

          return issuedSospeso;
        });
      },
    }),
  };
}

export const server = createActionServer(createFakeRepository());
