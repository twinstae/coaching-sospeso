import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { SospesoConsumingForm } from "./SospesoConsumingForm.tsx";

describe("SospesoConsumingForm", () => {
  test("필수 값을 입력하지 않으면 에러가 난다", async () => {
    // given 렌더를 함
    let result = {}; // mock
    render(
      <SospesoConsumingForm
        onSubmit={async (command) => {
          result = command;
        }}
      />,
    );

    // when 사용자가 클릭이나 입력
    await queryTL.button("소스페소 사용하기").click();

    // then expect 뭐시기를 하면서 검증을 함!
    await expectTL(queryTL.alert("코치를 선택해주세요")).toBeVisible();
    await expectTL(queryTL.alert("코칭 일시를 입력해주세요")).toBeVisible();
    await expectTL(queryTL.alert("후기를 입력해주세요")).toBeVisible();
    await expectTL(queryTL.alert("메모를 입력해주세요")).toBeVisible();

    expect(result).toEqual({});
  });

  test("필수 값을 입력하면 폼을 제출할 수 있다", async () => {
    let result = {};
    render(
      <SospesoConsumingForm
        onSubmit={async (command) => {
          result = command;
        }}
      />,
    );

    const expected = {
      coachId: crypto.randomUUID(),
      consumedAt: new Date("2024-11-07T13:07:34.000Z"),
      content: "너무 도움이 되었어요!",
      memo: "장소 시간 어쩌구 코칭 일지 링크 등등",
    };

    await queryTL.textbox("코치").fill(expected.coachId); // TODO: select로 나중에 바꿔야 함
    await queryTL.textbox("코칭일시").fill(expected.consumedAt.toString()); // TODO: date picker로 나중에 바꿔야 함
    await queryTL.textbox("후기").fill(expected.content);
    await queryTL.textbox("메모").fill(expected.memo); // TODO: markdown editor로 나중에 바꿔야 함

    await queryTL.button("소스페소 사용하기").click();

    expect(result).toEqual(expected);
  });
});
