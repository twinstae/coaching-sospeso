import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { SospesoDetail } from "./SospesoDetail";
import { href } from "@/routing/href.ts";
import {
  CONSUMED_SOSPESO,
  ISSUED_SOSPESO,
  PENDING_SOSPESO,
} from "@/sospeso/fixtures";
import { ToastifyToastContainer, toastifyToastApi } from "@/adapters/toastApi";

const STAMP_ALT = "사용됨";

describe("SospesoDetail", () => {
  test("소스페소의 기본 정보를 볼 수 있다", async () => {
    render(<SospesoDetail sospeso={ISSUED_SOSPESO} />);

    await expectTL(queryTL.text("From. 탐정토끼")).toBeVisible();
    await expectTL(queryTL.text("To. 퀴어 문화 축제 올 사람")).toBeVisible();
  });

  // 신청하기 페이지로 보내는 버튼(링크)
  test("발행된 소스페소에서는 신청할 수 있는 링크를 볼 수 있다", async () => {
    render(<SospesoDetail sospeso={ISSUED_SOSPESO} />);

    await expectTL(queryTL.link("신청하기")).toHaveAttribute(
      "href",
      href("소스페소-신청", { sospesoId: ISSUED_SOSPESO.id }),
    );
  });

  // -> 사용됨 (스탬프 쾅)
  test("이미 사용된 소스페소는 스탬프가 있다", async () => {
    render(<SospesoDetail sospeso={CONSUMED_SOSPESO} />);

    await expectTL(queryTL.link("신청하기")).not.toBeVisible();
    await expectTL(queryTL.img(STAMP_ALT)).toBeVisible();
  });

  // -> 대기 중 pending
  test("대기 중인 소스페소는 대기중 버튼이 비활성화되어있다.", async () => {
    render(<SospesoDetail sospeso={PENDING_SOSPESO} />);

    await expectTL(queryTL.button("대기중")).toHaveAttribute("disabled", "");
  });

  test("소스페소 링크를 복사하면 성공했다는 토스트 메세지를 보여준다.", async () => {
    render(
      <SospesoDetail
        sospeso={ISSUED_SOSPESO}
        toastApi={toastifyToastApi}
        clipboardApi={{ copy: async () => {} }}
      />,
      {
        wrapper: ({ children }) => (
          <>
            {children}
            <ToastifyToastContainer />
          </>
        ),
      },
    );

    await queryTL.button("공유 링크 복사하기").click();

    await expectTL(queryTL.alert("alert-success")).toHaveText(
      "소스페소 링크를 복사했어요!",
    );
  });

  test("소스페소 링크를 복사에 실패하면 실패했다는 토스트 메세지를 보여준다.", async () => {
    render(
      <SospesoDetail
        sospeso={ISSUED_SOSPESO}
        toastApi={toastifyToastApi}
        clipboardApi={{
          copy: async () => {
            throw new Error("복사 실패");
          },
        }}
      />,
      {
        wrapper: ({ children }) => (
          <>
            {children}
            <ToastifyToastContainer />
          </>
        ),
      },
    );

    await queryTL.button("공유 링크 복사하기").click();

    await expectTL(queryTL.alert("alert-error")).toHaveText(
      "복사 권한을 허용했는지 확인해 주세요.",
    );
  });

  // 소스페소 링크를 공유할 수 있다 → 나와 비슷한 사람에게 이 기회를 공유하고 싶다
  test("공유할 링크를 복사할 수 있다.", async () => {
    let result = "";
    const clipboardApi = {
      copy: async (text: string) => {
        result = text;
      },
    };
    // given 렌더
    render(
      <SospesoDetail sospeso={ISSUED_SOSPESO} clipboardApi={clipboardApi} />,
    );

    // when 버튼을 클릭하면
    await queryTL.button("공유 링크 복사하기").click();

    // then 클립보드에 링크가 복사된다
    expect(result).toBe("http://localhost:63315/sospeso/" + ISSUED_SOSPESO.id);
  });

  test("소스페소를 사용한 후기를 볼 수 있다.", async () => {
    // given 렌더
    render(<SospesoDetail sospeso={CONSUMED_SOSPESO} />);

    // 후기를 쓴 사람의 이름
    await expectTL(
      queryTL.text(CONSUMED_SOSPESO.consuming.consumer.nickname),
    ).toBeVisible();
    // 후기 내용을 볼 수 있다
    await expectTL(
      queryTL.text(CONSUMED_SOSPESO.consuming.content),
    ).toBeVisible();
  });
});
