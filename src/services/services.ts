import invariant from "@/invariant";
import { issueSospeso, type SospesoIssuingCommand } from "@/sospeso/domain";
import type { SospesoRepositoryI } from "@/sospeso/repository";

export const sospesoServices = {
  issueSospeso: async ({
    sospesoRepo,
    command,
    context: { user },
  }: {
    sospesoRepo: SospesoRepositoryI;
    command: SospesoIssuingCommand;
    context: {
      user?: {
        id: string;
        nickname: string;
        role: "user" | "admin";
      };
    };
  }) => {
    invariant(user, "로그인을 해야 합니다");
    const applicantId = user.id;

    invariant(applicantId, "로그인해야 소스페소를 발행할 수 있어요!");

    await sospesoRepo.updateOrSave(command.sospesoId, () => {
      const issuedSospeso = issueSospeso(command);

      return issuedSospeso;
    });
  },
};
