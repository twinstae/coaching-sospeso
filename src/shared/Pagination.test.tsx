import { render } from "@testing-library/react";
import { describe, test } from "vitest";
import { Pagination } from "./Pagination";
import { expectTL } from "@/siheom/expectTL";
import { queryTL } from "@/siheom/queryTL";
import { href } from '@/routing/href';

describe("Pagination", () => {
  test("각 페이지로 가는 링크들이 있다", async () => {
    render(<Pagination current={2} />);
    
    await expectTL(queryTL.link("1")).toHaveAttribute("href",
        href("홈", { page: 1 })
    )
  });

  test("현재 페이지를 알 수 있다", async () => {
    render(<Pagination current={2} />);

    await expectTL(queryTL.link("2")).toBeCurrent("page");
  });

  test("4페이지까지 있으면 1 2 3 4 페이지의 버튼이 보인다", async () => {
    render(<Pagination current={2} />);
  });
});
