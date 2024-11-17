import { describe, expect, test } from "vitest";
import { href } from "./href.ts";
import { parseRouteParamsFromUrl } from "./parseRouteParams.ts";
import { generateNanoId } from "@/adapters/generateId.ts";

const TEST_SOSPESO_ID = generateNanoId();
const TEST_CONSUMER_ID = generateNanoId();
describe("parseRouteParams", () => {
  test("정적인 route의 params를 읽어올 수 있다", () => {
    const path = href("어드민", undefined);

    const url = new URL(window.origin + path);

    expect(parseRouteParamsFromUrl("어드민", url)).toEqual(undefined);
  });

  test("동적인 route의 params를 읽어올 수 있다", () => {
    const path = href("어드민-소스페소-사용", {
      sospesoId: TEST_SOSPESO_ID,
      consumerId: TEST_CONSUMER_ID,
    });

    const url = new URL(window.origin + path);

    expect(parseRouteParamsFromUrl("어드민-소스페소-사용", url)).toEqual({
      sospesoId: TEST_SOSPESO_ID,
      consumerId: TEST_CONSUMER_ID,
    });
  });

  test("URL에 못 들어갈 값들도 처리할 수 있다", () => {
    const TEST_ID = "#@!TT RST김토끼-=_/+"; // 뛰어쓰기 한글 특수문자 슬래시와 골뱅이 등
    const path = href("파라미터-테스트", {
      testId: TEST_ID,
      q: TEST_ID,
    });

    const url = new URL(window.origin + path);

    expect(parseRouteParamsFromUrl("파라미터-테스트", url)).toEqual({
      testId: TEST_ID,
      q: TEST_ID,
    });
  });
});
