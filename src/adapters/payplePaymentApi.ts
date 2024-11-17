import * as v from "valibot";

import { formatDate } from "./dateApi.ts";
import { env } from "./env.ts";
import invariant from "@/invariant.ts";
import type { PaymentT } from '@/payment/domain.ts';

export type PayplePaymentApiI = {
  generatePaymentLink: (payment: PaymentT) => Promise<{
    paymentLink: string;
  }>;
};

const partnerAuthResultSchema = v.object({
  result: v.picklist(["success", "error"]),
  cst_id: v.string(),
  custKey: v.string(),
  AuthKey: v.string(),
  return_url: v.string(),
});


const linkGenerationResultSchema = v.object({
    result: v.picklist(["success", "error"]),
    PCD_LINK_URL: v.string(),
  });

export const payplePaymentApi = {
  generatePaymentLink: async (payment: PaymentT) => {
    const partnerAuthPayload = {
      cst_id: env.PAYPLE_CST_ID,
      custKey: env.PAYPLE_CUST_KEY,
      PCD_PAY_WORK: "LINKREG",
    };

    // 파트너 인증 https://docs.payple.kr/integration/domestic-linkpay
    const partnerAuthResult = await fetch(env.PAYPLE_HOST + "/php/auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify(partnerAuthPayload),
    })
      .then((res) => res.json())
      .then((body) => v.parse(partnerAuthResultSchema, body));

    invariant(
      partnerAuthResult.result === "success",
      "파트너 인증에 실패했습니다! " + JSON.stringify(partnerAuthPayload),
    );

    // 링크 생성 요청 https://docs.payple.kr/parameters/domestic-linkpay#%EB%A7%81%ED%81%AC%EC%83%9D%EC%84%B1%EC%9A%94%EC%B2%AD
    const linkGenerationResult = await fetch(
      env.PAYPLE_HOST + "/php/link/api/LinkRegAct.php?ACT_=LINKREG",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          PCD_CST_ID: partnerAuthResult.cst_id,
          PCD_CUST_KEY: partnerAuthResult.custKey,
          PCD_AUTH_KEY: partnerAuthResult.AuthKey,
          PCD_PAY_WORK: "LINKREG",
          PCD_PAY_TYPE: "transfer+card", // "card" | "transfer" | "transfer+card"
          PCD_PAY_GOODS: payment.goodsTitle,
          PCD_PAY_GOODS_EXPLAIN: payment.goodsDescription,
          PCD_PAY_TOTAL: payment.paymentTotalAmount,
          PCD_LINK_EXPIREDATE: formatDate(payment.expiredDate, "YYYYMMddHH"), // "2024110315" 2024년 11월 3일 15시
          PCD_LINK_PARAMETER: "",
          PCD_PAY_ISTAX: false, // 비과세
          PCD_LINK_NOTI_MSG: "", // 결제 완료 후 메세지
          PCD_LINK_URL: payment.afterLinkUrl, // 결제 완료 후 이동할 URL
          PCD_TAXSAVE_FLAG: "Y" // 현금영수증
        }),
      },
    )
    .then((res) => res.json())
    .then((body) => v.parse(linkGenerationResultSchema, body));;

    return {
      paymentLink:
        linkGenerationResult.PCD_LINK_URL
    };
  },
} satisfies PayplePaymentApiI;

export const fakePayplePaymentApi = {
  generatePaymentLink: async (payment: PaymentT) => {
    return {
      paymentLink:
        "https://democpay.payple.kr/php/link/?SID=MTI6MTU4NDYwNzI4Mg"
    };
  },
} satisfies PayplePaymentApiI;
