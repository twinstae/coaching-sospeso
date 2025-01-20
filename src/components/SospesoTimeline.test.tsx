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
  test("소스페소가 발행된 상태면 해당 상태에 맞는 UI를 보여준다", () => {
    renderTL(<SospesoTimeline status={ISSUED_SOSPESO["status"]} />);
    expectTL(queryTL.status("발행됨")).toBeVisible();
    expectTL(queryTL.status("신청됨")).not.toBeVisible();
    expectTL(queryTL.status("사용됨")).not.toBeVisible();
  });

  test("소스페소가 신청된 상태면 해당 상태에 맞는 UI를 보여준다", () => {
    renderTL(<SospesoTimeline status={PENDING_SOSPESO["status"]} />);
    expectTL(queryTL.status("발행됨")).toBeVisible();
    expectTL(queryTL.status("신청됨")).toBeVisible();
    expectTL(queryTL.status("사용됨")).not.toBeVisible();
  });

  test("소스페소가 사용된 상태면 해당 상태에 맞는 UI를 보여준다", () => {
    renderTL(<SospesoTimeline status={CONSUMED_SOSPESO["status"]} />);
    expectTL(queryTL.status("발행됨")).toBeVisible();
    expectTL(queryTL.status("신청됨")).toBeVisible();
    expectTL(queryTL.status("사용됨")).toBeVisible();
  });
});
