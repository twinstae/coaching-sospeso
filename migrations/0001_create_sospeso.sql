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
ALTER TABLE `user` ADD `nickname` text NOT NULL;