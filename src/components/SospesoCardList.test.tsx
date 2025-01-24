import { renderTL } from "@/siheom/renderTL.tsx";
import { describe, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { TEST_SOSPESO_LIST_ITEM } from "@/sospeso/fixtures";
import { SospesoCardList } from "./SospesoCardList";
import { href } from "@/routing/href";

describe("SospesoCardList", () => {
  test("목록에서 소스페소의 기본 정보를 볼 수 있다", async () => {
    renderTL(<SospesoCardList sospesoList={[TEST_SOSPESO_LIST_ITEM]} />);

    await expectTL(queryTL.link(/FROM. 탐정토끼/)).toHaveAttribute(
      "href",
      href("소스페소-상세", { sospesoId: TEST_SOSPESO_LIST_ITEM.id }),
    );
    await expectTL(queryTL.heading("TO.퀴어 문화 축제 올 사람")).toBeVisible();
    await expectTL(queryTL.time("발행일")).toHaveText("2024년 11월 9일");
  });

  test("신청자가 있는 소스페소라면 '신청자 있음' 문구를 보여준다.", async () => {
    renderTL(
      <SospesoCardList
        sospesoList={[{ ...TEST_SOSPESO_LIST_ITEM, status: "pending" }]}
      />,
    );
    await expectTL(queryTL.text("신청자 있음")).toBeVisible();
  });

  test("이미 사용한 소스페소라면 '사용함' 문구를 보여준다.", async () => {
    renderTL(
      <SospesoCardList
        sospesoList={[{ ...TEST_SOSPESO_LIST_ITEM, status: "consumed" }]}
      />,
    );
    await expectTL(queryTL.text("사용함")).toBeVisible();
  });
});
