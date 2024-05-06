ALTER TABLE "occurrences" ADD COLUMN "type" text;--> statement-breakpoint
ALTER TABLE "occurrences" DROP COLUMN IF EXISTS "text";