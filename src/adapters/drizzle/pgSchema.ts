import { relations } from "drizzle-orm/relations";
import { pgTable, text, json, integer, timestamp, boolean } from "drizzle-orm/pg-core";
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  nickname: text("nickname").notNull(),
  role: text("role").notNull(),
  phone: text("phone").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// sospeso
export const sospeso = pgTable("sospeso", {
  id: text("id").primaryKey(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  status: text("status").notNull().default("issued"),
});

export const sospesoRelations = relations(sospeso, ({ one, many }) => ({
  issuing: one(sospesoIssuing),
  applicationList: many(sospesoApplication),
  consuming: one(sospesoConsuming),
}));

export const sospesoIssuing = pgTable("sospeso_issuing", {
  id: text("id").primaryKey(),
  sospesoId: text("sospeso_id")
    .references(() => sospeso.id)
    .notNull(),
  paidAmount: integer("paid_amount").notNull(),
  issuerId: text("issuer_id")
    .references(() => user.id)
    .notNull(),
  issuedAt: timestamp("issued_at").notNull(),
});

export const sospesoIssuingRelations = relations(sospesoIssuing, ({ one }) => ({
  sospeso: one(sospeso, {
    fields: [sospesoIssuing.sospesoId],
    references: [sospeso.id],
  }),
}));

export const sospesoApplication = pgTable("sospeso_application", {
  id: text("id").primaryKey(),
  sospesoId: text("sospeso_id")
    .references(() => sospeso.id)
    .notNull(),
  status: text("status").notNull(),
  content: text("content").notNull(),
  applicantId: text("applicant_id")
    .references(() => user.id)
    .notNull(),
  appliedAt: timestamp("issued_at").notNull(),
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

export const sospesoConsuming = pgTable("sospeso_consuming", {
  id: text("id").primaryKey(),
  sospesoId: text("sospeso_id")
    .references(() => sospeso.id)
    .notNull(),
  consumedAt: timestamp("issued_at").notNull(),
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

export const payment = pgTable("payment", {
  id: text("id").primaryKey(),
  status: text("status").notNull(),
  goodsTitle: text("goods_title").notNull(),
  goodsDescription: text("goods_description").notNull(),
  totalAmount: integer("total_amount").notNull(),
  expiredDate: timestamp("expired_date").notNull(),
  afterLinkUrl: text("after_link_url").notNull(),
  command: json("command").notNull(),
  paymentResult: json("payment_result"),
});
