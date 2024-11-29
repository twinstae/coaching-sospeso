import { describe, it, expect } from "vitest";
import { formatPhoneNumber } from "./phone.ts";

describe("formatPhoneNumber", () => {
  it("should format domestic mobile numbers", () => {
    expect(formatPhoneNumber("01048271733")).toBe("010-4827-1733");
  });

  it("should format regional numbers", () => {
    expect(formatPhoneNumber("0319231733")).toBe("031-923-1733");
  });

  it("should format Seoul numbers with 8 digits", () => {
    expect(formatPhoneNumber("02111222")).toBe("021-1122-2");
  });

  it("should format Seoul numbers with 9 digits", () => {
    expect(formatPhoneNumber("021112222")).toBe("02-111-2222");
  });

  it("should handle numbers with existing hyphens", () => {
    expect(formatPhoneNumber("010-4827-1733")).toBe("010-4827-1733");
  });

  it("should handle numbers with spaces", () => {
    expect(formatPhoneNumber("010 4827 1733")).toBe("010-4827-1733");
  });
});
