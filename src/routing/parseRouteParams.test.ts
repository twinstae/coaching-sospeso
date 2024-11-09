import { describe, expect, test } from "vitest";
import { href } from "./href.ts";
import { UUIDGeneratorApi } from "@/adapters/IdGeneratorApi.ts";
import { parseRouteParamsFromUrl } from "./parseRouteParams.ts";

const TEST_SOSPESO_ID = "08c08822-aa80-4ea3-8959-bed518802920";
const TEST_CONSUMER_ID = UUIDGeneratorApi.generateId();
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
});
