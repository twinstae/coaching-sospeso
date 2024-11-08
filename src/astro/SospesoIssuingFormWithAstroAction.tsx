import { SospesoIssuingForm } from "@/components/SospesoIssuingForm.tsx";
import { navigate } from "@/routing/navigate.ts";
import { actions } from "astro:actions";
import { useMemo } from "react";

export const SospesoIssuingFormWithAstroAction = () => {
    const sospesoId = useMemo(() => crypto.randomUUID(), []);
  
    return (
      <SospesoIssuingForm
        onSubmit={async (command) => {
          actions.issueSospeso({ sospesoId, ...command }).then(() => {
            navigate("소스페소-상세", { sospesoId });
          });
        }}
      />
    );
  };
  