CREATE TABLE `accounts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` serial AUTO_INCREMENT,
	`type` tinytext NOT NULL,
	`provider` tinytext NOT NULL,
	`providerAccountId` tinytext NOT NULL,
	`refresh_token` tinytext,
	`access_token` tinytext,
	`expires_at` int,
	`token_type` tinytext,
	`scope` tinytext,
	`id_token` tinytext,
	`session_state` tinytext,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` enum('user','admin') NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` serial AUTO_INCREMENT,
	`sessionToken` tinytext NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userRoles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` serial AUTO_INCREMENT,
	`roleId` serial AUTO_INCREMENT,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userRoles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` tinytext,
	`email` tinytext NOT NULL,
	`emailVerified` timestamp DEFAULT (now()),
	`image` tinytext,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`identifier` tinytext NOT NULL,
	`token` tinytext NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationToken_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_provider_providerAccountId` ON `accounts` (`provider`,`providerAccountId`);--> statement-breakpoint
CREATE INDEX `idx_sessionToken` ON `sessions` (`sessionToken`);--> statement-breakpoint
CREATE INDEX `idx_userId` ON `userRoles` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_roleId` ON `userRoles` (`roleId`);--> statement-breakpoint
CREATE INDEX `idx_identifier_token` ON `verificationToken` (`identifier`,`token`);--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userRoles` ADD CONSTRAINT `userRoles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userRoles` ADD CONSTRAINT `userRoles_roleId_roles_id_fk` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;