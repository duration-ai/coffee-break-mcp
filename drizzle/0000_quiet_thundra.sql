CREATE TABLE `coffee_breaks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`duration_ms` integer,
	`is_complete` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`api_token` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_api_token_unique` ON `users` (`api_token`);