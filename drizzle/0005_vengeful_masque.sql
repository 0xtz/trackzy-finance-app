ALTER TABLE "trackzy_budget" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "trackzy_category" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "trackzy_expense" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "trackzy_income" ADD COLUMN "deleted_at" timestamp;