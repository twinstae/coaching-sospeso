import type { APIRoute } from "astro";
import { actions } from "astro:actions";

const parseSospesoId = (linkAddParam: string) => {
  const params = JSON.parse(linkAddParam);
  return params.id;
}

// 페이플 결제 웹훅
export const POST: APIRoute = async ({ request, callAction }) => {
  const params = await request.json();
  const { PCD_PAY_RST, PCD_PAY_CODE, PCD_PAY_TYPE, PCD_LINK_ADD_PARAM } = params;
 
  if (PCD_PAY_RST === "success" && PCD_PAY_CODE === "0000" && PCD_PAY_TYPE === "card") {
    // 카드결제 성공
    const paymentId = parseSospesoId(PCD_LINK_ADD_PARAM);
    await callAction(actions.completeSospesoPayment, { sospesoId: paymentId, paymentResult: params });
    await callAction(actions.issueSospeso, { sospesoId: paymentId });
  }

  if (PCD_PAY_RST === "success" && PCD_PAY_CODE === "BILL0000" && PCD_PAY_TYPE === "transfer") {
    // 계좌이체 성공
    const paymentId = parseSospesoId(PCD_LINK_ADD_PARAM);
    await callAction(actions.completeSospesoPayment, { sospesoId: paymentId, paymentResult: params });
    await callAction(actions.issueSospeso, { sospesoId: paymentId });
  }

  return new Response(
    JSON.stringify({
      message: "success",
    }),
  );
};
