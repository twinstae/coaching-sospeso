import { renderTL } from "@/siheom/renderTL";

import { SospesoTimeline } from "./SospesoTimeline";
import {
  CONSUMED_SOSPESO,
  ISSUED_SOSPESO,
  PENDING_SOSPESO,
} from "@/sospeso/fixtures";
import { queryTL } from "@/siheom/queryTL";
import { expectTL } from "@/siheom/expectTL";
import { describe, test } from "vitest";

describe("SospesoTimeline", () => {
  test("발행됨 상태", () => {
    renderTL(<SospesoTimeline status={ISSUED_SOSPESO["status"]} />);
    expectTL(queryTL.listitem("발행됨")).toBeCurrent("step");
    expectTL(queryTL.listitem("신청됨")).not.toBeCurrent("step");
    expectTL(queryTL.listitem("사용됨")).not.toBeCurrent("step");
  });

  test("신청됨 상태", () => {
    renderTL(<SospesoTimeline status={PENDING_SOSPESO["status"]} />);
    expectTL(queryTL.listitem("발행됨")).not.toBeCurrent("step");
    expectTL(queryTL.listitem("신청됨")).toBeCurrent("step");
    expectTL(queryTL.listitem("사용됨")).not.toBeCurrent("step");
  });

  test("사용됨 상태", () => {
    renderTL(<SospesoTimeline status={CONSUMED_SOSPESO["status"]} />);
    expectTL(queryTL.listitem("발행됨")).not.toBeCurrent("step");
    expectTL(queryTL.listitem("신청됨")).not.toBeCurrent("step");
    expectTL(queryTL.listitem("사용됨")).toBeCurrent("step");
  });
});
