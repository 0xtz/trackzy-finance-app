ALTER TABLE "trackzy_user" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "trackzy_user" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "trackzy_user" DROP COLUMN "last_name";