import { SospesoTimeline } from "./SospesoTimeline";
import {
  CONSUMED_SOSPESO,
  ISSUED_SOSPESO,
  PENDING_SOSPESO,
} from "@/sospeso/fixtures";
import { describe, test } from "vitest";
import { given } from "@/siheom/given";
import { assertions } from "@/siheom/assert";
import { query } from "@/siheom/query";
import { runSiheom } from "@/siheom/siheom";

describe("SospesoTimeline", () => {
  test("발행됨 상태", async () => runSiheom(
    given.render(<SospesoTimeline status={ISSUED_SOSPESO["status"]} />),
    assertions.current(query.listitem("발행됨"), "step"),
    assertions.not.current(query.listitem("신청됨"), "step"),
    assertions.not.current(query.listitem("사용됨"), "step"),
  ));

  test("신청됨 상태", async () => runSiheom(
    given.render(<SospesoTimeline status={PENDING_SOSPESO["status"]} />),
    assertions.not.current(query.listitem("발행됨"), "step"),
    assertions.current(query.listitem("신청됨"), "step"),
    assertions.not.current(query.listitem("사용됨"), "step"),
  ));

  test("사용됨 상태", async () => runSiheom(
    given.render(<SospesoTimeline status={CONSUMED_SOSPESO["status"]} />),
    assertions.not.current(query.listitem("발행됨"), "step"),
    assertions.not.current(query.listitem("신청됨"), "step"),
    assertions.current(query.listitem("사용됨"), "step"),
  ));
});