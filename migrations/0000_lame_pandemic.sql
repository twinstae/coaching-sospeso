CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `sospeso` (
	`id` text PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sospeso_application` (
	`id` text PRIMARY KEY NOT NULL,
	`sospeso_id` text NOT NULL,
	`status` text NOT NULL,
	`content` text NOT NULL,
	`applicant_id` text NOT NULL,
	`issued_at` integer NOT NULL,
	FOREIGN KEY (`sospeso_id`) REFERENCES `sospeso`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`applicant_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sospeso_consuming` (
	`id` text PRIMARY KEY NOT NULL,
	`sospeso_id` text,
	`issued_at` integer NOT NULL,
	`content` text NOT NULL,
	`memo` text NOT NULL,
	`consumer_id` text NOT NULL,
	`coach_id` text NOT NULL,
	FOREIGN KEY (`sospeso_id`) REFERENCES `sospeso`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`consumer_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`coach_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sospeso_issuing` (
	`id` text PRIMARY KEY NOT NULL,
	`sospeso_id` text NOT NULL,
	`paid_amount` integer NOT NULL,
	`issuer_id` text NOT NULL,
	`issued_at` integer NOT NULL,
	FOREIGN KEY (`sospeso_id`) REFERENCES `sospeso`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`issuer_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`nickname` text DEFAULT '손님' NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
