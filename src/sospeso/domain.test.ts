import { describe, expect, test } from "vitest";
import {
  applySospeso,
  approveApplication,
  isApplicationLocked,
  issueSospeso,
  isConsumed,
  rejectApplication,
  consumeSospeso,
  isApproved,
} from "./domain.ts";

describe("sospeso", () => {
  const sospesoId = crypto.randomUUID();
  const now = new Date();
  const issuedSospeso = issueSospeso({
    sospesoId: sospesoId,
    issuedAt: now,
    from: '탐정토끼',
    to: '퀴어 문화 축제 올 사람'
  });

  test("소스페소를 발행할 수 있다.", () => {
    expect(issuedSospeso.id).toBe(sospesoId);
    expect(issuedSospeso.issuing.id).toBe(sospesoId);
    expect(issuedSospeso.issuing.issuedAt).toBe(now);

    expect(issuedSospeso.applicationList).toHaveLength(0);
    expect(isConsumed(issuedSospeso)).toBe(false);
  });

  const firstApplicationId = crypto.randomUUID();

  const appliedSospeso = applySospeso(issuedSospeso, {
    sospesoId: issuedSospeso.id,
    applicationId: firstApplicationId,
    appliedAt: new Date(),
  });

  test("소스페소에 신청할 수 있다", () => {
    expect(appliedSospeso.applicationList).toHaveLength(1);
    expect(isApproved(issuedSospeso)).toBe(false);
    expect(isConsumed(issuedSospeso)).toBe(false);
  });

  test("하나의 소스페소에 두 번 신청할 수는 없다", () => {
    expect(() => {
      applySospeso(appliedSospeso, {
        sospesoId: issuedSospeso.id,
        applicationId: crypto.randomUUID(),
        appliedAt: new Date(),
      });
    }).toThrowError("[Conflict Error] 소스페소를 이미 신청한 사람이 있습니다.");
  });

  const approvedSospeso = approveApplication(appliedSospeso, {
    sospesoId: issuedSospeso.id,
    applicationId: firstApplicationId,
  });
  test("소스페소 신청을 승인할 수 있다", () => {
    expect(isApproved(approvedSospeso)).toEqual(true);
  });

  const rejectedSospeso = rejectApplication(appliedSospeso, {
    sospesoId: issuedSospeso.id,
    applicationId: firstApplicationId,
  });

  test("소스페소 신청을 거절할 수 있다", () => {
    expect(
      rejectedSospeso.applicationList.map((application) => application.status),
    ).toEqual(["rejected"]);
  });

  test("이미 승인한 소스페소 신청도 소스페소 신청도 취소할 수 있다", () => {
    const reversedApplication = rejectApplication(approvedSospeso, {
      sospesoId: issuedSospeso.id,
      applicationId: firstApplicationId,
    });

    expect(
      reversedApplication.applicationList.map(
        (application) => application.status,
      ),
    ).toEqual(["rejected"]);
  });

  test("거절한 소스페소는 다시 신청할 수 있다", () => {
    expect(isApplicationLocked(rejectedSospeso)).toBe(false);

    const secondApplicationId = crypto.randomUUID();

    const appliedSospeso = applySospeso(rejectedSospeso, {
      sospesoId: rejectedSospeso.id,
      applicationId: secondApplicationId,
      appliedAt: new Date(),
    });

    const approvedSospeso = approveApplication(appliedSospeso, {
      sospesoId: appliedSospeso.id,
      applicationId: secondApplicationId,
    });

    expect(approvedSospeso.applicationList.map(a => a.status)).toEqual(["rejected", "approved"])
  });

  test("두 번 이상 거절할 수도 있다", () => {
    const secondApplicationId = crypto.randomUUID();

    const appliedSospeso = applySospeso(rejectedSospeso, {
      sospesoId: rejectedSospeso.id,
      applicationId: secondApplicationId,
      appliedAt: new Date(),
    });

    const rejectedAgainSospeso = rejectApplication(appliedSospeso, {
      sospesoId: appliedSospeso.id,
      applicationId: secondApplicationId,
    });

    expect(rejectedAgainSospeso.applicationList.map(a => a.status)).toEqual(["rejected", "rejected"])
  });

  test("승인된 소스페소를 사용 처리할 수 있다", () => {
    expect(isConsumed(approvedSospeso)).toBe(false);

    const consumedSospeso = consumeSospeso(approvedSospeso, {
      sospesoId: issuedSospeso.id,
      consumingId: crypto.randomUUID(),
      consumedAt: new Date(),
    });

    expect(isConsumed(consumedSospeso)).toBe(true);
  });
});
