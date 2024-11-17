import { renderTL } from '@/siheom/renderTL.tsx';
import { describe, test } from "vitest";
import { Pagination } from "./Pagination";
import { expectTL } from "@/siheom/expectTL";
import { queryTL } from "@/siheom/queryTL";
import { href } from "@/routing/href";

describe("Pagination", () => {
  test("각 페이지로 가는 링크들이 있다", async () => {
    renderTL(<Pagination routeKey="홈" params={{}} current={2} end={4} />);

    await expectTL(queryTL.link("1")).toHaveAttribute(
      "href",
      href("홈", { page: 1 }),
    );
  });

  test("현재 페이지를 알 수 있다", async () => {
    renderTL(<Pagination routeKey="홈" params={{}} current={2} end={4} />);

    await expectTL(queryTL.link("2")).toBeCurrent("page");
  });

  test("처음 페이지에서는 이전 링크가 보이지 않는다", async () => {
    renderTL(<Pagination routeKey="홈" params={{}} current={1} end={4} />);

    await expectTL(queryTL.link(new RegExp(""))).toHaveTextContents([
      "1",
      "2",
      "3",
      "4",
      "다음",
    ]);
  });

  test("마지막 페이지에서는 다음 링크가 보이지 않는다", async () => {
    renderTL(<Pagination routeKey="홈" params={{}} current={4} end={4} />);

    await expectTL(queryTL.link(new RegExp(""))).toHaveTextContents([
      "이전",
      "1",
      "2",
      "3",
      "4",
    ]);
  });

  test("링크는 전체 페이지 개수 만큼만 보인다", async () => {
    renderTL(<Pagination routeKey="홈" params={{}} current={2} end={4} />);

    await expectTL(queryTL.link(new RegExp(""))).toHaveTextContents([
      "이전",
      "1",
      "2",
      "3",
      "4",
      "다음",
    ]);
  });
});
