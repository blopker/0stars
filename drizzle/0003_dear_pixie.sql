CREATE INDEX `idx_ratings_ip_address_created_at` ON `ratings` (`ipaddress`,`createdat`);--> statement-breakpoint
CREATE INDEX `idx_ratings_user_review` ON `ratings` (`userid`,`reviewid`);