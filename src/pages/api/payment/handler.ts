import type { APIRoute } from "astro";
import { createPaymentServices, createSospesoServices } from "@/services/services";
import { paymentRepo, sospesoRepo } from "@/actions/actions";

const parseSospesoId = (linkAddParam: string): string => {
  const params = JSON.parse(linkAddParam);
  return params.id;
}

// 페이플 결제 웹훅
export const POST: APIRoute = async ({ request }) => {
  const params = await request.json();
  const { PCD_PAY_RST, PCD_PAY_CODE, PCD_PAY_TYPE, PCD_LINK_ADD_PARAM } = params;

  const sospesoServices = createSospesoServices(sospesoRepo);
  const paymentServices = createPaymentServices(paymentRepo);
 
  const succeededCardPayment = PCD_PAY_RST === "success" && PCD_PAY_CODE === "0000" && PCD_PAY_TYPE === "card";
  const succeededBankTransfer = PCD_PAY_RST === "success" && PCD_PAY_CODE === "BILL0000" && PCD_PAY_TYPE === "transfer";

  if (succeededCardPayment || succeededBankTransfer) {
    const paymentId = parseSospesoId(PCD_LINK_ADD_PARAM);
    await paymentServices.completePayment(paymentId, params);
    const payment = await paymentRepo.retrievePayment(paymentId);
    await sospesoServices.issueSospeso(payment.command);
  }

  return new Response(
    JSON.stringify({
      message: "success",
    }),
  );
};
