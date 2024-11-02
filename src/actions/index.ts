import { fakeRepository } from '@/sospeso/repository.ts';
import * as domain from '@/sospeso/domain.ts'
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

const sospesoRepo = fakeRepository;

export const server = {
  retrieveSospesoList: defineAction({
    input: z.object({}),
    handler: async (_input) => {
        return sospesoRepo.retrieveSospesoList();
    }
  }),
  issueSospeso: defineAction({
    input: z.object({
      sospesoId: z.string(),
      from: z.string(),
      to: z.string()
    }),
    handler: async (input) => {
      const issuedSospeso = domain.issueSospeso({ ...input, issuedAt: new Date() })
      
      sospesoRepo.save(issuedSospeso);
    }
  }),
}