ALTER TABLE "project" ADD COLUMN "keywords_tr" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "keywords_en" text[] DEFAULT '{}' NOT NULL;