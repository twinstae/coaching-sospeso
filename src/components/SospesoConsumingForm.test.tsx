import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import {
  sospesoConsumingEventBus,
  SospesoConsumingForm,
} from "./SospesoConsumingForm.tsx";
import { SafeEventHandler } from "@/event/SafeEventHandler.tsx";
import { generateNanoId } from "@/adapters/generateId.ts";
import { TEST_COACH_LIST, 김태희_코치 } from "@/sospeso/fixtures.ts";

const TEST_ID = generateNanoId();

describe("SospesoConsumingForm", () => {
  test("필수 값을 입력하지 않으면 에러가 난다", async () => {
    // given 렌더를 함
    let result = {}; // mock
    render(
      <SafeEventHandler
        bus={sospesoConsumingEventBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <SospesoConsumingForm coachList={TEST_COACH_LIST} />
      </SafeEventHandler>,
    );

    await queryTL.textbox("코칭일시").clear();

    // when 사용자가 클릭이나 입력
    await queryTL.button("소스페소 사용하기").click();

    // then expect 뭐시기를 하면서 검증을 함!
    await expectTL(queryTL.combobox("코치")).toHaveErrorMessage(
      "코치를 선택해주세요",
    );
    await expectTL(queryTL.textbox("코칭일시")).toHaveErrorMessage(
      "코칭 일시를 입력해주세요",
    );
    await expectTL(queryTL.textbox("후기")).toHaveErrorMessage(
      "후기를 입력해주세요",
    );
    await expectTL(queryTL.textbox("메모")).toHaveErrorMessage(
      "메모를 입력해주세요",
    );

    expect(result).toEqual({});
  });

  test("필수 값을 입력하면 폼을 제출할 수 있다", async () => {
    let result = {};
    render(
      <SafeEventHandler
        bus={sospesoConsumingEventBus}
        onEvent={(command) => {
          result = command;
        }}
      >
        <SospesoConsumingForm
          today={new Date("2024-11-07T00:00:00.000Z")}
          generateId={() => TEST_ID}
          coachList={TEST_COACH_LIST}
        />
      </SafeEventHandler>,
    );

    const expected = {
      coachId: 김태희_코치.id,
      consumingId: TEST_ID,
      consumedAt: new Date("2024-11-03T00:00:00.000Z"),
      content: "너무 도움이 되었어요!",
      memo: "장소 시간 어쩌구 코칭 일지 링크 등등",
    };

    await queryTL.combobox("코치").click();
    await queryTL.option("김태희").click();

    await queryTL.textbox("코칭일시").fill("2024-11-03"); // TODO: date picker로 나중에 바꿔야 함
    await queryTL.textbox("후기").fill(expected.content);
    await queryTL.textbox("메모").fill(expected.memo); // TODO: markdown editor로 나중에 바꿔야 함

    await queryTL.button("소스페소 사용하기").click();

    await expectTL(queryTL.alert(new RegExp(""))).not.toBeVisible();
    expect(result).toEqual(expected);
  });
});
