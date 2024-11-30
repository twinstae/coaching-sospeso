import { paymentRepo, sospesoRepo } from "@/actions/actions";
import type { PaymentRepositoryI } from "@/payment/repository";
import { createSospesoServices } from "@/services/services";
import type { SospesoRepositoryI } from "@/sospeso/repository";
import type { APIRoute } from "astro";

const parseSospesoId = (linkAddParam: string) => {
  const params = JSON.parse(linkAddParam);
  return params.id;
};

export function createHandler({
  sospesoRepo,
  paymentRepo,
}: {
  sospesoRepo: SospesoRepositoryI;
  paymentRepo: PaymentRepositoryI;
}) {
  const services = createSospesoServices({ sospesoRepo, paymentRepo });

  return (async ({ request }: { request: Request }) => {
    const params = await request.json();
    const { PCD_PAY_RST, PCD_PAY_CODE, PCD_PAY_TYPE, PCD_LINK_ADD_PARAM } =
      params;

    if (
      PCD_PAY_RST === "success" &&
      PCD_PAY_CODE === "0000" &&
      PCD_PAY_TYPE === "card"
    ) {
      // 카드결제 성공
      const paymentId = parseSospesoId(PCD_LINK_ADD_PARAM);
      const event = await services.completeSospesoPayment({
        paymentId: paymentId,
        paymentResult: params,
      });
      await services.issueSospeso(event.payload);
    }

    if (
      PCD_PAY_RST === "success" &&
      PCD_PAY_CODE === "BILL0000" &&
      PCD_PAY_TYPE === "transfer"
    ) {
      // 계좌이체 성공
      const paymentId = parseSospesoId(PCD_LINK_ADD_PARAM);
      const event = await services.completeSospesoPayment({
        paymentId: paymentId,
        paymentResult: params,
      });
      await services.issueSospeso(event.payload);
    }

    return new Response(
      JSON.stringify({
        message: "success",
      }),
    );
  }) satisfies APIRoute;
}

// 페이플 결제 웹훅
export const POST: APIRoute = createHandler({ sospesoRepo, paymentRepo });
