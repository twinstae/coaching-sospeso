import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sospeso = sqliteTable("sospeso", {
  id: text("id").primaryKey(),
  from: text("from").notNull(),
  to: text("to").notNull(),
});

export const sospesoRelations = relations(sospeso, ({ one, many }) => ({
  issuing: one(sospesoIssuing),
  applicationList: many(sospesoApplication),
  consuming: one(sospesoConsuming),
}));

export const sospesoIssuing = sqliteTable("sospeso_issuing", {
  id: text("id").primaryKey(),
  sospesoId: text("sospeso_id").references(() => sospeso.id),
  issuedAt: integer("issued_at", { mode: "timestamp_ms" }).notNull(),
});

export const sospesoIssuingRelations = relations(sospesoIssuing, ({ one }) => ({
  sospeso: one(sospeso, {
    fields: [sospesoIssuing.sospesoId],
    references: [sospeso.id],
  }),
}));

export const sospesoApplication = sqliteTable("sospeso_application", {
  id: text("id").primaryKey(),
  sospesoId: text("sospeso_id").references(() => sospeso.id),
  status: text("status").notNull(),
  appliedAt: integer("issued_at", { mode: "timestamp_ms" }).notNull(),
});

export const sospesoApplicationRelations = relations(
  sospesoApplication,
  ({ one }) => ({
    sospeso: one(sospeso, {
      fields: [sospesoApplication.sospesoId],
      references: [sospeso.id],
    }),
  }),
);

export const sospesoConsuming = sqliteTable("sospeso_consuming", {
  id: text("id").primaryKey(),
  sospesoId: text("sospeso_id").references(() => sospeso.id),
  consumedAt: integer("issued_at", { mode: "timestamp_ms" }).notNull(),
});

export const sospesoConsumingRelations = relations(
  sospesoConsuming,
  ({ one }) => ({
    sospeso: one(sospeso, {
      fields: [sospesoConsuming.sospesoId],
      references: [sospeso.id],
    }),
  }),
);
