CREATE TABLE `ratings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userid` text NOT NULL,
	`reviewid` integer NOT NULL,
	`rating` integer NOT NULL,
	`createdat` integer,
	`ipaddress` text NOT NULL,
	FOREIGN KEY (`reviewid`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE no action
);
