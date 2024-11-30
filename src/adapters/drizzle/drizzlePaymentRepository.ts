import * as schema from "./schema.ts";
import * as v from "valibot";
import type { LibSQLDatabase } from "drizzle-orm/libsql/driver";
import type { Payment } from "@/payment/domain.ts";
import type { PaymentRepositoryI } from "@/payment/repository.ts";
import invariant from "@/invariant.ts";
import { eq } from "drizzle-orm/sql/expressions/conditions";

const paymentSchema = v.object({
  id: v.string(),
  status: v.picklist(["initiated", "paid", "cancelled"]),
  goodsTitle: v.string(),
  goodsDescription: v.string(),
  totalAmount: v.pipe(v.number(), v.integer(), v.minValue(1)),
  expiredDate: v.date(),
  afterLinkUrl: v.string(),
  command: v.any(),
  paymentResult: v.any(),
});

function dbModelToDomainModel(dbModel: {
  id: string;
  status: string;
  expiredDate: Date;
  goodsTitle: string;
  goodsDescription: string;
  totalAmount: number;
  afterLinkUrl: string;
  command: unknown;
  paymentResult: unknown;
}): Payment {
  return v.parse(paymentSchema, dbModel);
}

export function createDrizzlePaymentRepository(
  db: LibSQLDatabase<typeof schema>,
): PaymentRepositoryI {
  return {
    async retrievePayment(paymentId: string) {
      const result = await db.query.payment.findFirst({
        where: eq(schema.payment.id, paymentId),
      });
      invariant(result, "결제 내역을 찾지 못했어요!");

      return dbModelToDomainModel(result);
    },
    async updateOrSave(paymentId, update) {
      await db.transaction(async (tx) => {
        const result = await tx.query.payment.findFirst({
          where: eq(schema.payment.id, paymentId),
        });

        const before = result && dbModelToDomainModel(result);

        const after = update(before);

        const values = {
          id: after.id,
          status: after.status,
          expiredDate: after.expiredDate,
          goodsTitle: after.goodsTitle,
          goodsDescription: after.goodsDescription,
          totalAmount: after.totalAmount,
          afterLinkUrl: after.afterLinkUrl,
          command: after.command,
          paymentResult:
            after.status === "initiated" ? undefined : after.paymentResult,
        };

        await tx.insert(schema.payment).values(values).onConflictDoUpdate({
          target: schema.payment.id,
          set: values,
        });
      });
    },
  } satisfies PaymentRepositoryI;
}
