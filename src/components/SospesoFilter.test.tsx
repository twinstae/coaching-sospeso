import { renderTL } from "@/siheom/renderTL.tsx";
import { describe, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { SospesoFilter } from "./SospesoFilter.tsx";
import { href } from "@/routing/href.ts";

describe("SospesoFilter", () => {
  test("발행됨, 대기중, 사용함 상태를 필터하는 링크가 있다", async () => {
    renderTL(<SospesoFilter currentStatus={undefined} />);

    await expectTL(queryTL.link("발행")).toHaveAttribute(
      "href",
      href("홈", { page: 1, status: "issued" }), // /?status=issued
    );

    await expectTL(queryTL.link("신청")).toHaveAttribute(
      "href",
      href("홈", { page: 1, status: "pending" }),
    );

    await expectTL(queryTL.link("사용")).toHaveAttribute(
      "href",
      href("홈", { page: 1, status: "consumed" }),
    );
  });
});
