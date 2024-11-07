import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { SospesoApplicationDashboard } from "./SospesoApplicationDashboard.tsx";
import {
  TEST_APPLICATION_LIST,
  TEST_APPROVED_APPLICATION,
} from "@/sospeso/fixtures.ts";
import { tableToMarkdown } from "@/siheom/tableToMarkdown.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { href } from "@/routing.tsx";

describe("SospesoApplicationDashboard", () => {
  test("소스페소에 신청한 목록을 볼 수 있다", async () => {
    render(
      <SospesoApplicationDashboard
        applicationList={TEST_APPLICATION_LIST}
        actions={{
          async approveApplication(_command) {},
          async rejectApplication(_command) {},
        }}
      />,
    );

    expect(tableToMarkdown(queryTL.table("").get())).toMatchInlineSnapshot(`
      "|            수혜자 조건 |     신청한 날짜 | 신청한 사람 |                                                                                                                 내용 |                   상태 |
      | ---------------------- | --------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------- |
      | 퀴어 문화 축제 올 사람 | Wed Nov 06 2024 |      김토끼 | 저는 김씨가문 김유신의 52대손으로 태어나 어쩌구... 올해 퀴어 문화 축제에도 다녀왔으며, 모든 성소수자들을 지지합니다. | 신청함승인하기거절하기 |
      | 퀴어 문화 축제 올 사람 | Tue Nov 05 2024 |      혐오자 |                                                                   저는 소스페소에 이상한 요청을 보낸 나쁜 사람입니다 |                 거절됨 |
      |    시각 장애가 있는 분 | Tue Nov 05 2024 |   해적 토끼 |                                                          제 왼쪽 눈을 보십시오. 이것이야 말로 증거가 아니겠습니까?ㄷ | 승인됨거절하기사용하기 |
      "
    `);
  });

  test("신청된 소스페소를 승인할 수 있다", async () => {
    let approved = {};

    render(
      <SospesoApplicationDashboard
        applicationList={TEST_APPLICATION_LIST}
        actions={{
          async approveApplication(command) {
            approved = command;
          },
          async rejectApplication(_command) {},
        }}
      />,
    );

    await queryTL.button("신청함").click();

    await queryTL.button("승인하기").click();

    expect(approved).not.toEqual({});
  });

  test("신청한 소스페소를 거절할 수 있다", async () => {
    let rejected = {};

    render(
      <SospesoApplicationDashboard
        applicationList={TEST_APPLICATION_LIST}
        actions={{
          async approveApplication(_command) {},
          async rejectApplication(command) {
            rejected = command;
          },
        }}
      />,
    );

    await queryTL.button("신청함").click();

    await queryTL.button("거절하기").click();

    expect(rejected).not.toEqual({});
  });

  test("승인한 소스페소를 거절할 수 있다", async () => {
    let rejected = {};

    render(
      <SospesoApplicationDashboard
        applicationList={TEST_APPLICATION_LIST}
        actions={{
          async approveApplication(_command) {},
          async rejectApplication(command) {
            rejected = command;
          },
        }}
      />,
    );

    await queryTL.button("승인됨").click();

    await queryTL.button("거절하기").click();

    expect(rejected).not.toEqual({});
  });

  test("승인한 소스페소에서 사용하기 폼 페이지로 이동할 수 있다", async () => {
    render(
      <SospesoApplicationDashboard
        applicationList={TEST_APPLICATION_LIST}
        actions={{
          async approveApplication(_command) {},
          async rejectApplication(_command) {},
        }}
      />,
    );

    await queryTL.button("승인됨").click();

    await expectTL(queryTL.link("사용하기")).toHaveAttribute(
      "href",
      href("어드민-소스페소-사용", {
        sospesoId: TEST_APPROVED_APPLICATION.sospesoId,
        consumerId: TEST_APPROVED_APPLICATION.applicant.id,
      }),
    );
  });
});
