import { renderTL } from "@/siheom/renderTL.tsx";
import { describe, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { TEST_SOSPESO_LIST_ITEM } from "@/sospeso/fixtures";
import { SospesoCardList } from "./SospesoCardList";

describe("SospesoCardList", () => {
  test.todo("링크를 보여준다 (또는) 클릭하면 상세 페이지로 이동한다.");

  test("목록에서 소스페소의 기본 정보를 볼 수 있다", async () => {
    renderTL(<SospesoCardList sospesoList={[TEST_SOSPESO_LIST_ITEM]} />);

    await expectTL(queryTL.text("탐정토끼")).toBeVisible();
    await expectTL(queryTL.text("퀴어 문화 축제 올 사람")).toBeVisible();
    await expectTL(queryTL.text("2024년 11월 9일")).toBeVisible();
  });

  test("신청한 사람이 있다면 '신청자 있음' 문구를 보여준다.", async () => {
    renderTL(
      <SospesoCardList
        sospesoList={[{ ...TEST_SOSPESO_LIST_ITEM, status: "pending" }]}
      />,
    );
    await expectTL(queryTL.text("신청자 있음")).toBeVisible();
  });

  test("사용한 소스페소라면 '사용함' 문구를 보여준다.", async () => {
    renderTL(
      <SospesoCardList
        sospesoList={[{ ...TEST_SOSPESO_LIST_ITEM, status: "consumed" }]}
      />,
    );
    await expectTL(queryTL.text("사용함")).toBeVisible();
  });
});
