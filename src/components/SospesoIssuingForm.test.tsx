import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { SospesoIssuingForm } from "./SospesoIssuingForm";

describe("SospesoIssuingForm", () => {
  test("필수 값을 입력하지 않으면 에러가 난다", async () => {
    let result = {}
    render(
      <SospesoIssuingForm
      onSubmit={async (command) => {
        result = command
      }}
      />,
    );


    await queryTL.button("발행하기").click();

    await expectTL(queryTL.alert("From. 을 입력해주세요")).toBeVisible()
    expect(result).toEqual({})
  });

  test("필수 값을 입력하면 폼을 제출할 수 있다", async () => {
    let result = {}
    render(
      <SospesoIssuingForm
      onSubmit={async (command) => {
        result = command
      }}
      />,
    );

    const expected = {
      from: "탐정토끼",
      to: "퀴어 문화 축제 올 사람"
    }

    await queryTL.textbox("From.").fill(expected.from);
    await queryTL.textbox("To.").fill(expected.to);

    await queryTL.button("발행하기").click();
    
    expect(result).toEqual(expected)
  })
});
