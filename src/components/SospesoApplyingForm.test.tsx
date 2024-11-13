import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import {
  sospesoApplyingEventBus,
  SospesoApplyingForm,
} from "./SospesoApplyingForm.tsx";
import { SafeEventHandler } from "@/event/SafeEventHandler.tsx";
import { generateNanoId } from "@/adapters/generateId.ts";

const TEST_ID = generateNanoId();

describe("SospesoApplyingForm", () => {
  test("필수 값을 입력하지 않으면 에러가 난다", async () => {
    // given 렌더를 함
    let result = {}; // mock
    render(
      <SafeEventHandler
        bus={sospesoApplyingEventBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <SospesoApplyingForm />
      </SafeEventHandler>,
    );

    // when 사용자가 클릭이나 입력
    await queryTL.button("신청하기").click();

    // then expect 뭐시기를 하면서 검증을 함!
    await expectTL(queryTL.textbox("코치에게 쓰는 편지")).toHaveErrorMessage(
      "코치에게 쓸 편지를 입력해주세요",
    );

    expect(result).toEqual({});
  });

  test("필수 값을 입력하면 폼을 제출할 수 있다", async () => {
    let result = {};
    render(
      <SafeEventHandler
        bus={sospesoApplyingEventBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <SospesoApplyingForm generateId={() => TEST_ID} />
      </SafeEventHandler>,
    );

    // when 코치에게 쓰는 편지를 입력하고 신청하기 버튼을 클릭한다
    await queryTL
      .textbox("코치에게 쓰는 편지")
      .fill("퀴어 문화 축제 갔다왔어요~ Love wins all~");
    await queryTL.button("신청하기").click();

    // then expect 뭐시기를 하면서 검증을 함!
    await expectTL(
      queryTL.textbox("코치에게 쓰는 편지"),
    ).not.toHaveErrorMessage("코치에게 쓸 편지를 입력해주세요");

    expect(result).toEqual({
      applicationId: TEST_ID,
      content: "퀴어 문화 축제 갔다왔어요~ Love wins all~",
    });
  });
});
