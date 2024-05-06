ALTER TABLE "aggressors" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "occurrences" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "victims" DROP COLUMN IF EXISTS "occurrences";--> statement-breakpoint
ALTER TABLE "aggressors" DROP COLUMN IF EXISTS "occurrences";