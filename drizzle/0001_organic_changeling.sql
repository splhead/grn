CREATE TYPE "public"."news_placement" AS ENUM('main_cover', 'highlights', 'latest');--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "placement" "news_placement" DEFAULT 'latest' NOT NULL;