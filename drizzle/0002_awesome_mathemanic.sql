CREATE TABLE "trackzy_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "trackzy_user" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "trackzy_user" DROP COLUMN "role";