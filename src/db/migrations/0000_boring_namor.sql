CREATE TABLE `resources` (
	`id` text PRIMARY KEY NOT NULL,
	`section` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`url` text NOT NULL,
	`type` text NOT NULL,
	`tags` text
);
--> statement-breakpoint
CREATE INDEX `resources_section_idx` ON `resources` (`section`);--> statement-breakpoint
CREATE TABLE `saved_resources` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`resource_id` text NOT NULL,
	`saved_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `saved_resources_user_id_idx` ON `saved_resources` (`user_id`);--> statement-breakpoint
CREATE INDEX `saved_resources_resource_id_idx` ON `saved_resources` (`resource_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `saved_resources_user_id_resource_id_unique` ON `saved_resources` (`user_id`,`resource_id`);--> statement-breakpoint
CREATE TABLE `tools` (
	`id` text PRIMARY KEY NOT NULL,
	`section` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`config` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tools_slug_unique` ON `tools` (`slug`);--> statement-breakpoint
CREATE INDEX `tools_section_idx` ON `tools` (`section`);--> statement-breakpoint
CREATE TABLE `user_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`section` text NOT NULL,
	`interactions` integer DEFAULT 0 NOT NULL,
	`last_active` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_stats_user_id_section_unique` ON `user_stats` (`user_id`,`section`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`role` text DEFAULT 'user',
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);