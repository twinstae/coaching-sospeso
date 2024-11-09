import type { SospesoRepositoryI } from "@/sospeso/repository";
import * as schema from "./schema.ts";
import { eq } from "drizzle-orm";
import { calcStatus, type Sospeso } from "@/sospeso/domain.ts";
import * as v from "valibot";
import invariant from "@/invariant.ts";
import type { LibSQLDatabase } from "drizzle-orm/libsql/driver";

const sospesoSchema = v.object({
  id: v.string(),
  from: v.string(),
  to: v.string(),
  issuing: v.object({
    id: v.string(),
    issuedAt: v.date(),
    paidAmount: v.pipe(v.number(), v.minValue(1)),
    issuerId: v.string(),
  }),
  applicationList: v.array(
    v.object({
      id: v.string(),
      status: v.picklist(["applied", "approved", "rejected"]),
      appliedAt: v.date(),
      content: v.string(),
    }),
  ),
  consuming: v.undefinedable(
    v.object({
      id: v.string(),
      consumedAt: v.date(),
      content: v.string(),
      memo: v.string(),
      consumerId: v.string(),
      coachId: v.string(),
    }),
  ),
});

function dbModelToDomainModel(dbModel: {
  id: string;
  from: string;
  to: string;
  issuing: {
    id: string;
    paidAmount: number;
    issuerId: string;
    issuedAt: Date;
  } | null;
  applicationList: {
    id: string;
    status: string;
    appliedAt: Date;
    content: string;
  }[];
  consuming: {
    id: string;
    sospesoId: string | null;

    consumedAt: Date;
    content: string;
    memo: string;
    consumerId: string;
    coachId: string;
  } | null;
}): Sospeso {
  const result = {
    ...dbModel,
    issuing: dbModel.issuing,
    applicationList: dbModel.applicationList,
    consuming: dbModel.consuming ?? undefined,
  };

  return v.parse(sospesoSchema, result);
}

export function createDrizzleSospesoRepository(
  db: LibSQLDatabase<typeof schema>,
): SospesoRepositoryI {
  return {
    async retrieveSospesoList() {
      const result = await db.query.sospeso
        .findMany({
          with: {
            applicationList: true,
            consuming: true,
            issuing: true,
          },
        })
        .then((items) => items.map(dbModelToDomainModel));

      return result.map((sospeso) => {
        const status = calcStatus(sospeso);
        return {
          id: sospeso.id,
          from: sospeso.from,
          status,
          to: sospeso.to,
          issuedAt: sospeso.issuing.issuedAt,
        };
      });
    },
    async retrieveSospesoDetail(sospesoId) {
      const result = await db.query.sospeso.findFirst({
        where: eq(schema.sospeso.id, sospesoId),
        with: {
          applicationList: true,
          consuming: true,
          issuing: true,
        },
      });

      const sospeso = result && dbModelToDomainModel(result);

      if (sospeso === undefined) {
        return undefined;
      }

      const status = calcStatus(sospeso);

      if (status === "consumed") {
        return {
          id: sospeso.id,
          from: sospeso.from,
          status,
          to: sospeso.to,
          consuming: {
            // TODO: 사용 담당자가 유저 관리와 연결
            consumer: {
              id: "3231",
              nickname: "촛불이",
            },
            content: "후기..",
          },
        };
      }

      return {
        id: sospeso.id,
        from: sospeso.from,
        status,
        to: sospeso.to,
        consuming: undefined,
      };
    },
    async retrieveApplicationList() {
      const result = await db.query.sospeso
        .findMany({
          with: {
            applicationList: true,
            consuming: true,
            issuing: true,
          },
        })
        .then((items) => items.map(dbModelToDomainModel));

      return result.flatMap((sospeso) => {
        return sospeso.applicationList.map((application) => {
          return {
            id: application.id,
            sospesoId: sospeso.id,
            to: sospeso.to,
            status: application.status,
            appliedAt: application.appliedAt,
            content: application.content, // TODO! application에 content가 추가되야
            applicant: {
              // TODO! user가 만들어져야
              id: "",
              nickname: "김토끼",
            },
          };
        });
      });
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

        const before = result && dbModelToDomainModel(result);

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
                sospesoId,
                id: application.id,
                status: application.status,
                appliedAt: application.appliedAt,
                content: application.content,
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
                sospesoId,
                id: consuming.id,
                consumedAt: consuming.consumedAt,
                consumerId: consuming.consumerId,
                coachId: consuming.coachId,
                content: consuming.content,
                memo: consuming.memo,
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
            sospesoId,
            paidAmount: after.issuing.paidAmount,
            issuerId: after.issuing.issuerId,
            id: after.issuing.id,
            issuedAt: after.issuing.issuedAt,
          });

          for (const application of after.applicationList) {
            await tx.insert(schema.sospesoApplication).values({
              id: application.id,
              status: application.status,
              appliedAt: application.appliedAt,
              sospesoId,
              content: application.content,
            });
          }

          const consuming = after.consuming;
          if (consuming) {
            await tx.insert(schema.sospesoConsuming).values({
              id: consuming.id,
              consumedAt: consuming.consumedAt,
              consumerId: consuming.consumerId,
              coachId: consuming.coachId,
              content: consuming.content,
              memo: consuming.memo,
            });
          }
        }
      });
    },
  } satisfies SospesoRepositoryI;
}
