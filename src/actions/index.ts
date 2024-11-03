import {
  createFakeRepository,
  type SospesoRepositoryI,
} from "@/sospeso/repository.ts";
import * as domain from "@/sospeso/domain.ts";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import invariant from "@/invariant";

export function createActionServer(sospesoRepo: SospesoRepositoryI) {
  return {
    retrieveSospesoList: defineAction({
      input: z.object({}),
      handler: async (_input) => {
        return sospesoRepo.retrieveSospesoList();
      },
    }),
    issueSospeso: defineAction({
      input: z.object({
        sospesoId: z.string(),
        from: z.string(),
        to: z.string(),
      }),
      handler: async (input) => {
        await sospesoRepo.updateOrSave(input.sospesoId, (existed) => {
          invariant(existed === undefined, "이미 생성된 소스페소입니다!");

          return domain.issueSospeso({
            ...input,
            issuedAt: new Date(),
          });;
        });
      },
    }),
  };
}

export const server = createActionServer(createFakeRepository());
