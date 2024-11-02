import type { SospesoRepositoryI } from "@/sospeso/repository";
import * as schema from "./schema.ts";
import { eq } from "drizzle-orm";
import type { Sospeso } from "@/sospeso/domain.ts";
import * as v from "valibot";
import invariant from "@/invariant.ts";
import type { LibSQLDatabase } from 'drizzle-orm/libsql/driver';

const sospesoSchema = v.object({
  id: v.string(),
  from: v.string(),
  to: v.string(),
  issuing: v.object({
    id: v.string(),
    issuedAt: v.date(),
  }),
  applicationList: v.array(
    v.object({
      id: v.string(),
      status: v.picklist(["applied", "approved", "rejected"]),
      appliedAt: v.date(),
    }),
  ),
  consuming: v.undefinedable(
    v.object({
      id: v.string(),
      consumedAt: v.date(),
    }),
  ),
});

function dbModelToDomainModel(
  dbModel:
    | {
        id: string;
        from: string;
        to: string;
        issuing: {
          id: string;
          sospesoId: string | null;
          issuedAt: Date;
        } | null;
        consuming: {
          id: string;
          sospesoId: string | null;
          consumedAt: Date;
        } | null;
        applicationList: {
          id: string;
          sospesoId: string | null;
          status: string;
          appliedAt: Date;
        }[];
      }
    | undefined,
): Sospeso | undefined {
  if (dbModel === undefined) {
    return undefined;
  }
  const result = {
    ...dbModel,
    issuing: dbModel.issuing,
    applicationList: dbModel.applicationList,
    consuming: dbModel.consuming,
  };

  return v.parse(sospesoSchema, result);
}

export function createDrizzleSospesoRepository(
  db: LibSQLDatabase<typeof schema>,
): SospesoRepositoryI {
  return {
    async retrieveSospesoList() {
      const result = await db.select().from(schema.sospeso).execute();
      return result;
    },
    async updateOrSave(sospesoId, update) {
      await db.transaction(async (tx) => {
        
        const result = await tx.query.sospeso.findFirst({
          where: eq(schema.sospeso.id, sospesoId),
          with: {
            applicationList: true,
            consuming: true,
            issuing: true,
          },
        });

        const before = dbModelToDomainModel(result);

        const after = update(before);

        if (before) {
          await tx.update(schema.sospeso).set({
            id: after.id,
            from: after.from,
            to: after.to,
          });

          if (before.issuing !== after.issuing) {
            await tx.update(schema.sospesoIssuing).set({
              id: after.issuing.id,
              issuedAt: after.issuing.issuedAt,
            });
          }

          invariant(
            before.applicationList.length <= after.applicationList.length,
            "application은 아직 삭제할 수 없습니다.",
          );

          const updatedList = after.applicationList.filter(
            (a) => !before.applicationList.includes(a),
          );

          for (const application of updatedList) {
            await tx
              .insert(schema.sospesoApplication)
              .values({
                id: application.id,
                status: application.status,
                appliedAt: application.appliedAt,
              })
              .onConflictDoUpdate({
                target: schema.sospesoApplication.id,
                set: {
                  status: application.status,
                  appliedAt: application.appliedAt,
                },
              });
          }
          const consuming = after.consuming;
          if (consuming) {
            invariant(
              before.consuming === undefined,
              "consuming은 아직 수정할 수 없습니다",
            );
            await tx
              .insert(schema.sospesoConsuming)
              .values({
                id: consuming.id,
                consumedAt: consuming.consumedAt,
              })
              .onConflictDoNothing();
          }
        } else {
          await tx.insert(schema.sospeso).values({
            id: after.id,
            from: after.from,
            to: after.to,
          });
          
          await tx.insert(schema.sospesoIssuing).values({
            id: after.issuing.id,
            issuedAt: after.issuing.issuedAt,
          });
          
          for (const application of after.applicationList) {  
            await tx.insert(schema.sospesoApplication).values({
              id: application.id,
              status: application.status,
              appliedAt: application.appliedAt,
            });
          }
          
          const consuming = after.consuming;
          if (consuming) {
            await tx.insert(schema.sospesoConsuming).values({
              id: consuming.id,
              consumedAt: consuming.consumedAt,
            });
          }
        }
      });
    },
  } satisfies SospesoRepositoryI;
}
