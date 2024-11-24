import type { SospesoApplication, SospesoStatus } from "@/sospeso/domain.ts";

export const applicationStatusToLabelDict: Record<
  SospesoApplication["status"],
  string
> = {
  applied: "신청함",
  approved: "승인됨",
  rejected: "거절됨",
};

export const sospesoStatusToLabelDict = {
  issued: "발행됨",
  pending: "대기중",
  consumed: "사용함",
} satisfies Record<SospesoStatus, string>;
