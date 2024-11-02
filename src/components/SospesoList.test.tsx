import { render } from "@testing-library/react";
import { describe, test } from "vitest";
import { queryTL } from "@/siheom/queryTL.ts";
import { expectTL } from "@/siheom/expectTL.ts";
import { SospesoList } from "./SospesoList";

describe("SospesoList", () => {
  test("소스페소 목록을 렌더한다", async () => {
    render(
      <SospesoList
        sospesoList={[
          {
            id: crypto.randomUUID(),
            from: "탐정토끼",
            to: "퀴어 문화 축제 올 사람",
          },
        ]}
      />,
    );

    await expectTL(queryTL.link(/From/)).toHaveTextContents([
      "From. 탐정토끼 To. 퀴어 문화 축제 올 사람",
    ]);
  });
});
