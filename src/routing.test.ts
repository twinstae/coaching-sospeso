import { href } from "./routing.tsx";
import { describe, expect, test } from "vitest";

const testSospesoID = "08c08822-aa80-4ea3-8959-bed518802920";
describe("href", () => {
  test("정적인 루트의 path를 생성할 수 있다", () => {
    expect(href("홈", undefined)).toBe("/");
    expect(href("소스페소-발행", undefined)).toBe("/sospeso/issuing");
  });

  test("파라미터가 있는 동적인 루트의 path를 생성할 수 있다", () => {
    expect(href("소스페소-상세", { sospesoId: testSospesoID })).toBe(
      "/sospeso/" + testSospesoID,
    );
    expect(href("소스페소-신청", { sospesoId: testSospesoID })).toBe(
      "/sospeso/" + testSospesoID + "/application",
    );
  });

  test("파라미터가 잘못되면 에러를 던진다", () => {
    expect(() =>
      href("소스페소-상세", { sospesoId: "1123241243123" }),
    ).toThrowError("[invalid route params]");
  });
});
