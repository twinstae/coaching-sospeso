import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { sospesoIssuingEventBus, SospesoIssuingForm } from "./SospesoIssuingForm";
import { SafeEventHandler } from '@/event/SafeEventHandler';

const TEST_ID = crypto.randomUUID();

describe("SospesoIssuingForm", () => {
  test("필수 값을 입력하지 않으면 에러가 난다", async () => {
    let result = {};
    render(
      <SafeEventHandler
        bus={sospesoIssuingEventBus}
        onEvent={(detail) => {
          result = detail;
        }}>
        <SospesoIssuingForm
        idGeneratorApi={{ generateId() {
          return TEST_ID
        },}}
      />
      </SafeEventHandler>,
    );

    await queryTL.button("발행하기").click();

    await expectTL(queryTL.alert("From. 을 입력해주세요")).toBeVisible();
    expect(result).toEqual({});
  });

  test("필수 값을 입력하면 폼을 제출할 수 있다", async () => {
    let result = {};
    render(
      <SafeEventHandler
        bus={sospesoIssuingEventBus}
        onEvent={(detail) => {
          result = detail;
        }}>
        <SospesoIssuingForm
        idGeneratorApi={{ generateId() {
          return TEST_ID
        },}}
      />
      </SafeEventHandler>,
    );

    const expected = {
    sospesoId: TEST_ID,
      from: "탐정토끼",
      to: "퀴어 문화 축제 올 사람",
    };

    await queryTL.textbox("From.").fill(expected.from);
    await queryTL.textbox("To.").fill(expected.to);

    await queryTL.button("발행하기").click();

    expect(result).toEqual(expected);
  });
});
