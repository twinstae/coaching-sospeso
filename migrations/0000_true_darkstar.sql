CREATE TABLE IF NOT EXISTS "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"goods_title" text NOT NULL,
	"goods_description" text NOT NULL,
	"total_amount" integer NOT NULL,
	"expired_date" timestamp NOT NULL,
	"after_link_url" text NOT NULL,
	"command" json NOT NULL,
	"payment_result" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	"impersonatedBy" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sospeso" (
	"id" text PRIMARY KEY NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"status" text DEFAULT 'issued' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sospeso_application" (
	"id" text PRIMARY KEY NOT NULL,
	"sospeso_id" text NOT NULL,
	"status" text NOT NULL,
	"content" text NOT NULL,
	"applicant_id" text NOT NULL,
	"issued_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sospeso_consuming" (
	"id" text PRIMARY KEY NOT NULL,
	"sospeso_id" text NOT NULL,
	"issued_at" timestamp NOT NULL,
	"content" text NOT NULL,
	"memo" text NOT NULL,
	"consumer_id" text NOT NULL,
	"coach_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sospeso_issuing" (
	"id" text PRIMARY KEY NOT NULL,
	"sospeso_id" text NOT NULL,
	"paid_amount" integer NOT NULL,
	"issuer_id" text NOT NULL,
	"issued_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"nickname" text NOT NULL,
	"role" text NOT NULL,
	"phone" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sospeso_application" ADD CONSTRAINT "sospeso_application_sospeso_id_sospeso_id_fk" FOREIGN KEY ("sospeso_id") REFERENCES "public"."sospeso"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sospeso_application" ADD CONSTRAINT "sospeso_application_applicant_id_user_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sospeso_consuming" ADD CONSTRAINT "sospeso_consuming_sospeso_id_sospeso_id_fk" FOREIGN KEY ("sospeso_id") REFERENCES "public"."sospeso"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sospeso_consuming" ADD CONSTRAINT "sospeso_consuming_consumer_id_user_id_fk" FOREIGN KEY ("consumer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sospeso_consuming" ADD CONSTRAINT "sospeso_consuming_coach_id_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sospeso_issuing" ADD CONSTRAINT "sospeso_issuing_sospeso_id_sospeso_id_fk" FOREIGN KEY ("sospeso_id") REFERENCES "public"."sospeso"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sospeso_issuing" ADD CONSTRAINT "sospeso_issuing_issuer_id_user_id_fk" FOREIGN KEY ("issuer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
