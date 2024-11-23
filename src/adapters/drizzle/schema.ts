import { relations } from "drizzle-orm/relations";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", {
    mode: "boolean",
  }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updatedAt", {
    mode: "timestamp",
  }).notNull(),
  nickname: text("nickname").notNull(),
  role: text("role").default("user"),
  banned: integer("banned", {
    mode: "boolean",
  }),
  banReason: text("banReason"),
  banExpires: integer("banExpires", {
    mode: "timestamp",
  }),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updatedAt", {
    mode: "timestamp",
  }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  impersonatedBy: text("impersonatedBy"),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updatedAt", {
    mode: "timestamp",
  }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }).notNull(),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }),
  updatedAt: integer("updatedAt", {
    mode: "timestamp",
  }),
});

// sospeso
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
  sospesoId: text("sospeso_id")
    .references(() => sospeso.id)
    .notNull(),
  paidAmount: integer("paid_amount").notNull(),
  issuerId: text("issuer_id")
    .references(() => user.id)
    .notNull(),
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
  sospesoId: text("sospeso_id")
    .references(() => sospeso.id)
    .notNull(),
  status: text("status").notNull(),
  content: text("content").notNull(),
  applicantId: text("applicant_id")
    .references(() => user.id)
    .notNull(),
  appliedAt: integer("issued_at", { mode: "timestamp_ms" }).notNull(),
});

export const sospesoApplicationRelations = relations(
  sospesoApplication,
  ({ one }) => ({
    sospeso: one(sospeso, {
      fields: [sospesoApplication.sospesoId],
      references: [sospeso.id],
    }),
    applicant: one(user, {
      fields: [sospesoApplication.applicantId],
      references: [user.id],
    }),
  }),
);

export const sospesoConsuming = sqliteTable("sospeso_consuming", {
  id: text("id").primaryKey(),
  sospesoId: text("sospeso_id").references(() => sospeso.id),
  consumedAt: integer("issued_at", { mode: "timestamp_ms" }).notNull(),
  content: text("content").notNull(),
  memo: text("memo").notNull(),
  consumerId: text("consumer_id")
    .references(() => user.id)
    .notNull(),
  coachId: text("coach_id")
    .references(() => user.id)
    .notNull(),
});

export const sospesoConsumingRelations = relations(
  sospesoConsuming,
  ({ one }) => ({
    sospeso: one(sospeso, {
      fields: [sospesoConsuming.sospesoId],
      references: [sospeso.id],
    }),
    consumer: one(user, {
      fields: [sospesoConsuming.consumerId],
      references: [user.id],
    }),
  }),
);
