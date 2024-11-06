import type { SospesoApplication } from "@/sospeso/domain.ts";

export const applicationStatusToLabelDict: Record<SospesoApplication['status'], string> = {
    "applied": "신청함",
    "approved": "승인됨",
    "rejected": "거절됨"
}