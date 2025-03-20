import * as schema from "./schema.ts";
import * as v from "valibot";
import type { LibSQLDatabase } from "drizzle-orm/libsql/driver";
import {
  applyTransaction,
  type Account,
} from "@/accounting/domain.ts";
import type { AccountRepositoryI } from "@/accounting/repository.ts";
import { eq } from "drizzle-orm/sql/expressions/conditions";

const accountSchema = v.array(
  v.object({
    id: v.string(),
    name: v.string(),
    type: v.picklist(["asset", "capital", "debt"]),
    amount: v.pipe(v.number(), v.integer()),
    majorCategory: v.string(),
    middleCategory: v.undefinedable(v.string()),
    smallCategory: v.undefinedable(v.string()),
  }),
);

function dbModelToDomainModel(
  dbModel: {
    type: string;
    id: string;
    name: string;
    amount: number;
    majorCategory: string;
    middleCategory: string | null;
    smallCategory: string | null;
  }[],
): Account {
  const a = dbModel.map(item => {

    const result = { ...item } as any; // 방어적 복사

    if (result.smallCategory === null) {
      result["smallCategory"] = undefined
    }
    if (result.middleCategory === null) {
      result["middleCategory"] = undefined
    }

    return result;    
  })
  return v.parse(accountSchema, a);
}

export function createDrizzleAccountRepository(
  db: LibSQLDatabase<typeof schema>,
): AccountRepositoryI {
  return {
    async transact(accountId, transaction) {
      await db.transaction(async (tx) => {
        const result = await tx.query.accountItem.findMany({
          where: eq(schema.accountItem.accountId, accountId),
        });

        const before = result && dbModelToDomainModel(result);

        const after = applyTransaction(before, transaction);

        // 최신화된 account를 저장하기

        // transaction을 저장하기
        // 삭제하지 않는다. 수정하지 않는다 -> insert만 한다

        await tx.insert(schema.transaction).values({
          id: transaction.id,
          description: transaction.description,
        });

        for (const transactionItem of (
          transaction.left as {
            id: string;
            target: {
              type: string;
              name: string;
            };
            type: "증감";
            amount: number;
          }[]
        ).concat(transaction.right)) {
          const dbTransactionItem = {
            id: transactionItem.id,
            targetType: transactionItem.target.type,
            targetName: transactionItem.target.name,
            itemType: transactionItem.type,
            amount: transactionItem.amount,
            transactionId: transaction.id,
          };
          await tx.insert(schema.transactionItem).values(dbTransactionItem);
        }

        // 증감인 경우만 처리
        for (const accountItem of after) {
          await tx.update(schema.accountItem).set(accountItem).where(eq(schema.accountItem.id, accountItem.id));
        }
      });
    },
    async getOneById(accountId: string) {
      const result = await db.query.accountItem.findMany({
        where: eq(schema.accountItem.accountId, accountId),
      });

      return dbModelToDomainModel(result);
    },
  } satisfies AccountRepositoryI;
}
