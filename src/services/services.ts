import { issueSospeso, type SospesoIssuingCommand } from "@/sospeso/domain";
import type { SospesoRepositoryI } from "@/sospeso/repository";

export function createSospesoServices(sospesoRepo: SospesoRepositoryI) {
  return {
    issueSospeso: async (command: SospesoIssuingCommand) => {
      await sospesoRepo.updateOrSave(command.sospesoId, () => {
        const issuedSospeso = issueSospeso(command);

        return issuedSospeso;
      });
    },
  };
}
