PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`role` text,
	`banned` integer,
	`banReason` text,
	`banExpires` integer,
	`nickname` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt", "role", "banned", "banReason", "banExpires", "nickname") SELECT "id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt", "role", "banned", "banReason", "banExpires", "nickname" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `session` ADD `impersonatedBy` text;