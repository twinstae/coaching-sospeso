import { describe, expect, test } from "vitest";
import { applySospeso, issueSospeso, isUsed } from "./domain.ts";

describe("sospeso", () => {
  const sospesoId = crypto.randomUUID();
  const now = new Date();
  const issuedSospeso = issueSospeso({
    sospesoId: sospesoId,
    issuedAt: now,
  });

  test("소스페소를 발행할 수 있다.", () => {
    expect(issuedSospeso.id).toBe(sospesoId);
    expect(issuedSospeso.issuing.id).toBe(sospesoId);
    expect(issuedSospeso.issuing.issuedAt).toBe(now);

    expect(issuedSospeso.applicationList).toHaveLength(0);
    expect(isUsed(issuedSospeso)).toBe(false);
  });

  test("소스페소에 신청할 수 있다", () => {
    const appliedSospeso = applySospeso(issuedSospeso, {
      sospesoId: issuedSospeso.id,
      applicationId: crypto.randomUUID(),
      appliedAt: new Date(),
    });

    expect(appliedSospeso.applicationList).toHaveLength(1);
    expect(appliedSospeso.applicationList[0].status).toBe("applied");
  });

  test("하나의 소스페소에 두 번 신청할 수는 없다", () => {
    const appliedSospeso = applySospeso(issuedSospeso, {
        sospesoId: issuedSospeso.id,
        applicationId: crypto.randomUUID(),
        appliedAt: new Date(),
      });
    
    expect(() => {
        applySospeso(appliedSospeso, {
            sospesoId: issuedSospeso.id,
            applicationId: crypto.randomUUID(),
            appliedAt: new Date(),
        });
    }).toThrowError("[Conflict Error] 소스페소를 이미 신청한 사람이 있습니다.")
  });

  test("소스페소 신청을 승인할 수 있다", () => {

  });

  test("소스페소 신청을 거절할 수 있다", () => {});

  test("거절한 소스페소는 다시 신청할 수 있게 된다", () => {});

  test("소스페소를 사용 처리할 수 있다", () => {});
});
