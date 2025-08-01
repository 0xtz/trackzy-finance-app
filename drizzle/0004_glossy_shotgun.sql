CREATE TABLE "trackzy_budget" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"amount" numeric NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trackzy_category" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"color" text,
	"type" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trackzy_expense" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"amount" numeric NOT NULL,
	"date" timestamp NOT NULL,
	"icon" text,
	"user_id" text NOT NULL,
	"category_id" text,
	"budget_id" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trackzy_income" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"amount" numeric NOT NULL,
	"date" timestamp NOT NULL,
	"icon" text,
	"user_id" text NOT NULL,
	"category_id" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trackzy_budget" ADD CONSTRAINT "budget_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."trackzy_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trackzy_category" ADD CONSTRAINT "category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."trackzy_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trackzy_expense" ADD CONSTRAINT "expense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."trackzy_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trackzy_expense" ADD CONSTRAINT "expense_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."trackzy_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trackzy_expense" ADD CONSTRAINT "expense_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "public"."trackzy_budget"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trackzy_income" ADD CONSTRAINT "income_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."trackzy_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trackzy_income" ADD CONSTRAINT "income_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."trackzy_category"("id") ON DELETE no action ON UPDATE no action;