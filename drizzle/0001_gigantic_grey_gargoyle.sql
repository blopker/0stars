PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_places` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address` text,
	`country` text,
	`city` text,
	`cid` text NOT NULL,
	`googlemapsurl` text,
	`createdat` integer
);
--> statement-breakpoint
INSERT INTO `__new_places`("id", "name", "address", "country", "city", "cid", "googlemapsurl", "createdat") SELECT "id", "name", "address", "country", "city", "cid", "googlemapsurl", "createdat" FROM `places`;--> statement-breakpoint
DROP TABLE `places`;--> statement-breakpoint
ALTER TABLE `__new_places` RENAME TO `places`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `places_cid_unique` ON `places` (`cid`);--> statement-breakpoint
CREATE TABLE `__new_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`placeid` integer NOT NULL,
	`reviewtext` text NOT NULL,
	`rating` integer NOT NULL,
	`profileimage` text,
	`reviewername` text,
	`cid` text NOT NULL,
	`createdat` integer,
	FOREIGN KEY (`placeid`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "placeid", "reviewtext", "rating", "profileimage", "reviewername", "cid", "createdat") SELECT "id", "placeid", "reviewtext", "rating", "profileimage", "reviewername", "cid", "createdat" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_cid_unique` ON `reviews` (`cid`);