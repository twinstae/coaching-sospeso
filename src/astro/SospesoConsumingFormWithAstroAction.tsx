import { SospesoConsumingForm } from "@/components/SospesoConsumingForm.tsx";
import { navigate } from "@/routing/navigate.ts";
import { actions } from "astro:actions";
import { useMemo } from "react";

export const SospesoConsumingFormWithAstroAction = ({
  consumerId,
  sospesoId,
}: {
  sospesoId: string;
  consumerId: string;
}) => {
  const consumingId = useMemo(() => crypto.randomUUID(), []);

  return (
    <SospesoConsumingForm
      onSubmit={async (command) => {
        actions
          .consumeSospeso({
            ...command,
            consumingId,
            sospesoId,
            consumerId,
          })
          .then(() => {
            navigate("소스페소-상세", { sospesoId });
          });
      }}
    />
  );
};
