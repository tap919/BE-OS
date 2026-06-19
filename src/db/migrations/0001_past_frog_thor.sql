CREATE TABLE `module_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`module` text NOT NULL,
	`action_id` text NOT NULL,
	`status` text NOT NULL,
	`step_reached` integer DEFAULT 0,
	`saved_data` text,
	`completed_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `module_progress_user_id_module_action_id_unique` ON `module_progress` (`user_id`,`module`,`action_id`);