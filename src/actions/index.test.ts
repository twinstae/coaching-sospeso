import { describe, expect, test } from "vitest";
import { createActionServer } from "./index.ts";
import { createFakeRepository } from "@/sospeso/repository.ts";
import {
  TEST_SOSPESO_LIST_ITEM,
} from "@/sospeso/fixtures.ts";
import { approvedSospeso, issuedSospeso } from "@/sospeso/domain.test.ts";

describe("sospesoActionServer", () => {
  test("issueSospeso", async () => {
    const actionServer = createActionServer(createFakeRepository({}));
    const { data: before } = await actionServer.retrieveSospesoList({});

    expect(before).toStrictEqual([]);

    await actionServer.issueSospeso({
      sospesoId: TEST_SOSPESO_LIST_ITEM.id,
      ...TEST_SOSPESO_LIST_ITEM,
    });

    const { data: after } = await actionServer.retrieveSospesoList({});

    expect(after).toStrictEqual([TEST_SOSPESO_LIST_ITEM]);
  });

  test("applySospeso", async () => {
    const actionServer = createActionServer(
      createFakeRepository({
        [issuedSospeso.id]: issuedSospeso,
      }),
    );
    const { data: before } = await actionServer.retrieveSospesoDetail({
      sospesoId: issuedSospeso.id,
    });

    expect(before).toStrictEqual({
      consuming: undefined,
      from: "탐정토끼",
      id: issuedSospeso.id,
      status: "issued",
      to: "퀴어 문화 축제 올 사람",
    });

    await actionServer.applySospeso({
      sospesoId: issuedSospeso.id,
      applicationId: crypto.randomUUID(),
      applicationMsg: "저 퀴어 문화 축제 갔다 왔어요",
    });

    const { data: after } = await actionServer.retrieveSospesoDetail({
      sospesoId: issuedSospeso.id,
    });

    expect(after).toStrictEqual({
      consuming: undefined,
      from: "탐정토끼",
      id: issuedSospeso.id,
      status: "pending",
      to: "퀴어 문화 축제 올 사람",
    });
  });

  test("consumeSospeso", async () => {
    // 기존에 이미 승인된 소스페소가 있었음
    const actionServer = createActionServer(
      createFakeRepository({
        [approvedSospeso.id]: approvedSospeso,
      }),
    );

    const { data: before } = await actionServer.retrieveSospesoDetail({
      sospesoId: approvedSospeso.id,
    });

    expect(before?.status).toBe("pending");

    await actionServer.consumeSospeso({
      sospesoId: approvedSospeso.id,
      consumerId: "", // TODO user.id
      coachId: "", // user.id
      consumingId: crypto.randomUUID(),
      consumedAt: new Date(),
      content: "너무 도움이 되었어요!",
      memo: "장소 시간 어쩌구 코칭 일지 링크 등등",
    });

    const { data: after } = await actionServer.retrieveSospesoDetail({
      sospesoId: approvedSospeso.id,
    });

    expect(after?.status).toBe("consumed");
  });
});
