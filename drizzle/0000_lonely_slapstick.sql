DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "time_day" AS ENUM('manhã', 'tarde', 'noite');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"institute" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"city" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_links" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "auth_links_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "victims" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cpf" text NOT NULL,
	"phone" text,
	"district" text NOT NULL,
	"address" text NOT NULL,
	"age" integer,
	"profession" text,
	"marital_status" text,
	"ethnicity" text,
	"aux-gov" text,
	"childrens" boolean,
	"income" integer,
	"schooling" text,
	"disabled" boolean,
	"created_at" timestamp DEFAULT now(),
	"occurrences" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "victims_cpf_unique" UNIQUE("cpf"),
	CONSTRAINT "victims_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aggressors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cpf" text NOT NULL,
	"age" integer,
	"ethnicity" text,
	"schooling" text,
	"substance_addiction" boolean,
	"criminal_record" boolean,
	"occurrences" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "aggressors_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "occurrences" (
	"id" text PRIMARY KEY NOT NULL,
	"date" date,
	"time" "time_day",
	"institute" text NOT NULL,
	"bond" text,
	"drugs" boolean,
	"text" text,
	"victim" text,
	"aggressor" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_links" ADD CONSTRAINT "auth_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_victim_victims_id_fk" FOREIGN KEY ("victim") REFERENCES "victims"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_aggressor_aggressors_id_fk" FOREIGN KEY ("aggressor") REFERENCES "aggressors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
