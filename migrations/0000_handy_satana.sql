CREATE TABLE `sospeso` (
	`id` text PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sospeso_application` (
	`id` text PRIMARY KEY NOT NULL,
	`sospeso_id` text,
	`status` text NOT NULL,
	`issued_at` integer NOT NULL,
	FOREIGN KEY (`sospeso_id`) REFERENCES `sospeso`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sospeso_consuming` (
	`id` text PRIMARY KEY NOT NULL,
	`sospeso_id` text,
	`issued_at` integer NOT NULL,
	FOREIGN KEY (`sospeso_id`) REFERENCES `sospeso`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sospeso_issuing` (
	`id` text PRIMARY KEY NOT NULL,
	`sospeso_id` text,
	`issued_at` integer NOT NULL,
	FOREIGN KEY (`sospeso_id`) REFERENCES `sospeso`(`id`) ON UPDATE no action ON DELETE no action
);
