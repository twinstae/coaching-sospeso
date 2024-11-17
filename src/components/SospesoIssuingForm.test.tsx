import { renderTL } from "@/siheom/renderTL.tsx";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import {
  sospesoIssuingEventBus,
  SospesoIssuingForm,
} from "./SospesoIssuingForm";
import { SafeEventHandler } from "@/event/SafeEventHandler";
import { generateNanoId } from "@/adapters/generateId";

const TEST_ID = generateNanoId();

describe("SospesoIssuingForm", () => {
  test("필수 값을 입력하지 않으면 에러가 난다", async () => {
    // given 기존 상태, input, 외부 의존성
    let result = {};
    renderTL(
      <SafeEventHandler
        bus={sospesoIssuingEventBus}
        onEvent={(detail) => {
          // mock
          result = detail;
        }}
      >
        <SospesoIssuingForm userNickname="김토끼" />
      </SafeEventHandler>,
    );

    // From을 textbox role 지운다
    await queryTL.textbox("From.").clear();

    // when 사용자 동작
    await queryTL.button("발행하기").click();

    // then 이후의 상태, output, 부수효과
    await expectTL(queryTL.alert("From. 을 입력해주세요")).toBeVisible(); // 이후의 돔 상태

    expect(result).toEqual({}); // 부수효과가 일어나지 않았다
  });

  test("필수 값을 입력하면 폼을 제출할 수 있다", async () => {
    let result = {};

    const expected = {
      sospesoId: TEST_ID,
      from: "탐정토끼",
      to: "퀴어 문화 축제 올 사람",
    };

    renderTL(
      <SafeEventHandler
        bus={sospesoIssuingEventBus}
        onEvent={(detail) => {
          result = detail;
        }}
      >
        <SospesoIssuingForm
          generateId={() => TEST_ID}
          userNickname={expected.from}
        />
      </SafeEventHandler>,
    );

    await queryTL.textbox("To.").fill(expected.to);

    await queryTL.button("발행하기").click();

    expect(result).toEqual(expected);
  });
});
