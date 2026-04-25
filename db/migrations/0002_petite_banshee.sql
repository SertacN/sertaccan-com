CREATE TYPE "public"."project_status" AS ENUM('ACTIVE', 'WIP', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description_tr" text NOT NULL,
	"description_en" text NOT NULL,
	"long_description_tr" text NOT NULL,
	"long_description_en" text NOT NULL,
	"image_url" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"github_url" text,
	"live_url" text,
	"status" "project_status" DEFAULT 'WIP' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_slug_unique" UNIQUE("slug")
);
