CREATE TABLE `places` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address` text,
	`country` text,
	`city` text,
	`cid` text NOT NULL,
	`googlemapsurl` text,
	`createdat` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `places_cid_unique` ON `places` (`cid`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`placeid` integer NOT NULL,
	`reviewtext` text NOT NULL,
	`rating` integer NOT NULL,
	`profileimage` text,
	`reviewername` text,
	`cid` text NOT NULL,
	`createdat` integer DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`placeid`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_cid_unique` ON `reviews` (`cid`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessionid` text NOT NULL,
	`createdat` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_sessionid_unique` ON `users` (`sessionid`);